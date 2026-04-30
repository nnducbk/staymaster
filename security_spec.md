# Security Specification for StayMaster

## Data Invariants
1. A **Property** must have a valid `ownerId` matching the creator's UID.
2. A **Room** must belong to an existing **Property** owned by the same user.
3. A **Booking** must reference a valid `propertyId` and `roomId`.
4. `totalPrice` must be a positive number.
5. `checkOut` date must be after `checkIn` date.

## The Dirty Dozen (Attack Scenarios)
1. **Identity Spoofing**: User A tries to create a property with User B's `ownerId`.
2. **Ghost Field Injection**: Adding `isVerified: true` to a Property document to gain unearned status.
3. **Orphaned Room**: Creating a room with a non-existent `propertyId`.
4. **Relationship Hijacking**: User B tries to add a room to User A's property.
5. **Price Manipulation**: Booking with a `totalPrice` of $0 or negative.
6. **Date Poisoning**: `checkOut` before `checkIn`.
7. **Cross-Tenant List Scraping**: Listing all bookings in the system without filtering by `propertyId` or `ownerId`.
8. **PII Leak**: Unauthorized guest reading another guest's phone number.
9. **Terminal State Bypass**: Updating a 'cancelled' booking back to 'confirmed' without proper authorization.
10. **Resource Exhaustion**: Sending a 1MB string as a property name.
11. **Email Spoofing**: (If used) Accessing admin panels by setting email in profile without verification.
12. **Unauthorized Deletion**: User B deleting User A's property.

## Test Runner (Logic Verification)
The `firestore.rules` will be designed to block these scenarios.
