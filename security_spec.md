# Security Specification for Sthalika Booking System

## Data Invariants
1. A booking must have a valid `roomId`.
2. A booking's `checkIn` date must be before `checkOut`.
3. `totalPrice` must be a positive number.
4. `userId` must match the authenticated user during creation.
5. Once a booking is "confirmed" or "cancelled", only an admin can change the status.

## The "Dirty Dozen" Payloads (Denial Expected)
1. **Unauthenticated create**: Attempt to create a booking without being signed in.
2. **Identity Spoofing**: Signed-in user A attempts to create a booking with user B's `userId`.
3. **Ghost Field Injection**: Adding an `isVerified: true` field to a booking payload.
4. **Invalid Room Reference**: Creating a booking for a `roomId` that doesn't exist (if checked).
5. **Backdated Check-in**: Creating a booking with a `checkIn` date in the past.
6. **Price Manipulation**: Creating a booking for a luxury dome with a `totalPrice` of ₹1.
7. **Cross-User Read**: User A attempts to list user B's bookings.
8. **Unauthorized Status Change**: A user attempts to change their "pending" booking to "confirmed" without a system/admin update.
9. **Document ID Poisoning**: Using a 1KB string as a booking document ID.
10. **Array Overflow**: (Not applicable yet, but good to keep in mind).
11. **PII Leak**: Authenticated user attempts a blanket `get` on a user's private data.
12. **Self-Promotion**: User attempts to mark themselves as an admin.

## Test Runner (Draft)
A `firestore.rules.test.ts` would verify these. For this environment, I will focus on the rules implementation.
