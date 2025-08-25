import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertShipment = mutation({
  args: {
    shipmentId: v.string(),
    tracking: v.object({
      status: v.string(),
      currentLocation: v.object({
        city: v.string(),
        state: v.string(),
        country: v.string(),
        coordinates: v.object({ lat: v.number(), lng: v.number() }),
      }),
      estimatedDelivery: v.string(),
      carrier: v.string(),
      trackingNumber: v.string(),
      service: v.string(),
      shipmentDetails: v.object({
        weight: v.string(),
        dimensions: v.string(),
        origin: v.string(),
        destination: v.string(),
        value: v.string(),
      }),
      events: v.array(
        v.object({
          timestamp: v.string(),
          status: v.string(),
          location: v.string(),
          description: v.string(),
        })
      ),
    }),
  },
  handler: async (ctx, { shipmentId, tracking }) => {
    // resolve current user (if any) to link shipment to userId
    const identity = await ctx.auth.getUserIdentity();
    let currentUserId: string | null = null;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();
      if (user) currentUserId = user._id;
    }

    const existing = await ctx.db
      .query("shipments")
      .withIndex("byShipmentId", (q) => q.eq("shipmentId", shipmentId))
      .unique();

    let shipmentDocId = existing?._id;

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: tracking.status,
        currentLocation: tracking.currentLocation,
        estimatedDelivery: tracking.estimatedDelivery,
        carrier: tracking.carrier,
        trackingNumber: tracking.trackingNumber,
        service: tracking.service,
        shipmentDetails: tracking.shipmentDetails,
        lastUpdated: Date.now(),
        ...(existing.userId ? {} : currentUserId ? { userId: currentUserId as any } : {}),
      });
    } else {
      shipmentDocId = await ctx.db.insert("shipments", {
        shipmentId,
        status: tracking.status,
        currentLocation: tracking.currentLocation,
        estimatedDelivery: tracking.estimatedDelivery,
        carrier: tracking.carrier,
        trackingNumber: tracking.trackingNumber,
        service: tracking.service,
        shipmentDetails: tracking.shipmentDetails,
        lastUpdated: Date.now(),
        createdAt: Date.now(),
        userId: currentUserId as any,
      } as any);
    }

    // Replace events by appending new ones
    if (shipmentDocId) {
      // no bulk delete in Convex; events table is additive; we just insert new ones
      for (const e of tracking.events) {
        await ctx.db.insert("trackingEvents", {
          shipmentId: shipmentDocId,
          timestamp: e.timestamp,
          status: e.status,
          location: e.location,
          description: e.description,
          createdAt: Date.now(),
        });
      }
    }

    return shipmentDocId!;
  },
});

export const getShipment = query({
  args: { shipmentId: v.string() },
  handler: async (ctx, { shipmentId }) => {
    const shipment = await ctx.db
      .query("shipments")
      .withIndex("byShipmentId", (q) => q.eq("shipmentId", shipmentId))
      .unique();
    if (!shipment) return null;
    const events = await ctx.db
      .query("trackingEvents")
      .withIndex("byShipmentId", (q) => q.eq("shipmentId", shipment._id))
      .collect();
    return { shipment, events };
  },
});

// New: list shipments for dashboard
export const listShipments = query({
  args: { search: v.optional(v.string()), onlyMine: v.optional(v.boolean()) },
  handler: async (ctx, { search, onlyMine }) => {
    let list = [] as any[];
    if (onlyMine) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];
      const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();
      if (!user) return [];
      list = await ctx.db
        .query("shipments")
        .withIndex("byUserId", (q) => q.eq("userId", user._id))
        .collect();
    } else {
      list = await ctx.db.query("shipments").collect();
    }

    if (!search || search.trim() === "") return list;
    const s = search.toLowerCase();
    return list.filter((sh) => {
      const fields = [
        sh.shipmentId,
        sh.status,
        sh.carrier,
        sh.service,
        sh.trackingNumber,
        sh.shipmentDetails.origin,
        sh.shipmentDetails.destination,
      ]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());
      return fields.some((f) => f.includes(s));
    });
  },
});