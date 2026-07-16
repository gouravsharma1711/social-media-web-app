# User Model

## Overview

The **User** model is the central entity of the Social Media application. Every feature in the system is associated directly or indirectly with a user.

The model stores user profile information, authentication credentials, account settings, cached statistics, and references to user interests.

---

# Responsibilities
The User model is responsible for:

- User registration
- User authentication
- Profile management
- Managing public/private accounts
- Tracking follower statistics
- Tracking post statistics
- JWT token generation
- Password hashing
- Maintaining user interests

---
# Schema

| Field | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| userName | String | ✅ | — | Unique username used throughout the application |
| fullName | String | ✅ | — | User's full display name |
| email | String | ✅ | — | Unique email address |
| password | String | ✅ | — | Encrypted user password |
| phoneNo | String | ✅ | — | Unique phone number |
| countryCode | String | ✅ | — | Phone country code |
| country | String | ✅ | — | Country name |
| gender | Enum | ✅ | — | male, female or other |
| profileImage | String | ❌ | "" | Profile picture URL |
| bio | String | ❌ | "" | User biography |
| dob | Date | ✅ | — | Date of birth |
| lastSeen | Date | ❌ | null | Last active timestamp |
| accountType | Enum | ❌ | normal | Creator or normal account |
| isPrivate | Boolean | ❌ | false | Private account visibility |
| isVerified | Boolean | ❌ | false | Verification badge |
| interests | ObjectId[] | ❌ | [] | References to Interest collection |
| refreshToken | String | ❌ | null | Current refresh token |
| followersCount | Number | ❌ | 0 | Cached follower count |
| followingCount | Number | ❌ | 0 | Cached following count |
| postCount | Number | ❌ | 0 | Cached post count |
| createdAt | Date | Auto | — | Document creation timestamp |
| updatedAt | Date | Auto | — | Last update timestamp |

---


# Validation Rules

## Username

- Required
- Unique
- Minimum length: 3
- Maximum length: 30
- Allowed characters

```text
a-z
A-Z
0-9
_
.
```

Regex

```regex
^[a-zA-Z0-9_.]+$
```

---

## Email

- Required
- Unique
- Converted to lowercase
- Valid email format

Regex

```regex
^\S+@\S+\
```

---

## Password

- Required
- Minimum length: 8
- Maximum length: 100
- Never returned in queries (`select: false`)
- Stored using bcrypt hashing

---

## Phone Number

- Required
- Unique
- Supports 6–15 digits

Regex
```text
^[0-9]{6,15}$
```

---

## Country Code

Format

```text
+91
+1
+44
```

Regex
```text
^\+\d{1,4}$
```

---

## Date of Birth

- Required
- Cannot be a future date

---

# Relationships

## One-to-Many (1:M)

### One User → Many Posts

A user can create multiple posts, but each post belongs to exactly one user.

---

### One User → Many Stories

A user can upload multiple stories, but each story belongs to only one user.

---

### One User → Many Comments

A user can write multiple comments across different posts, while each comment is authored by a single user.

---

### One User → Many Likes

A user can like multiple posts, comments, or stories. Every Like record belongs to one user.

---

### One User → Many Story Views

A user can view many story items. Each StoryView record represents one user viewing one story item.

---

### One User → Many Notifications (Receiver)

A user can receive multiple notifications such as likes, comments, follows, mentions, and tags.

---

### One User → Many Notifications (Sender)

A user can trigger notifications for other users through actions like following, commenting, mentioning, or liking.

---

### One User → Many Messages

A user can send multiple messages, but every message has exactly one sender.

---

### One User → Many Mentions (mentionedUser)

A user can be mentioned multiple times in comments or stories. Each Mention record references one mentioned user.

---

### One User → Many Mentions (mentionedBy)

A user can mention multiple users in comments or stories. Each Mention record stores the user who performed the mention.

---

### One User → Many Post Tags (taggedUser)

A user can be tagged in many different posts. Each PostTag record references one tagged user.

---

### One User → Many Post Tags (taggedBy)

A user can tag multiple users across different posts. Each PostTag record stores the user who added the tag.

---


## Many-to-Many (M:M)

### Many Users ↔ Many Posts (Saved Posts)

A user can save multiple posts, and a post can be saved by multiple users. This many-to-many relationship is implemented using the `SavedPost` collection, where each document represents one user saving one post.

### Many Users ↔ Many Interests

Users can select multiple interests, and the same interest can be associated with multiple users. This many-to-many relationship is implemented by storing an array of Interest ObjectIds in the User model.

---

### Many Users ↔ Many Users (Follow System)

A user can follow many users, and each user can have many followers. This relationship is implemented using the `Follow` collection.

---

### Many Users ↔ Many Users (Block System)

A user can block multiple users, and a user can be blocked by multiple users. This relationship is implemented using the `Block` collection, where each document represents one blocking relationship.

---

### Many Users ↔ Many Users (Close Friends)

A user can add multiple users to their close friends list, and a user can appear in the close friends lists of multiple users.

---

### Many Users ↔ Many Conversations (Participants)

A user can participate in multiple conversations, and each conversation can have multiple participants. This relationship is implemented using the `participants` array in the Conversation model.

---

### Many Users ↔ Many Conversations (Group Admins)

A user can administer multiple group conversations, and a group conversation can have multiple administrators. This relationship is implemented using the `groupAdmin` array in the Conversation model.

# Indexes

```javascript
userSchema.index({ userName: 1 }, { unique: true });

userSchema.index({ email: 1 }, { unique: true });

userSchema.index({ phoneNo: 1 }, { unique: true });
```

## Why these indexes?

### Username

Used during

- Login
- Profile search
- Mentions
- Profile URLs

---

### Email

Used during

- Login
- Registration
- Password reset

---

### Phone Number

Used during

- Registration
- Login
- Duplicate prevention

---


# Middleware

## Pre Save

Before storing a user

- Password is automatically hashed using bcrypt
- Password is hashed only when modified

---

# Instance Methods

## comparePassword()

Compares the entered password with the encrypted password stored in the database.

Returns

```text
Boolean
```

---

## generateAccessToken()

Generates a JWT access token.

Payload

```text
_id
```
Returns

```text
accessToken(String)
```

---

## generateRefreshToken()

Generates a JWT refresh token.

Payload

```text
_id
userName
email
```
Returns
```text
refreshToken(String)
```

---

# Cached Fields

The following fields are stored to improve query performance.

```text
followersCount

followingCount

postCount
```

Instead of calculating

```javascript
Follow.countDocuments()

Post.countDocuments()
```

on every request, these values are updated whenever the corresponding action occurs.

This significantly improves profile loading performance.

---

# Example Document

```json
{
  "_id": "685b7d2a8d3c4e5f6a7b8c9d",
  "userName": "gourav123",
  "fullName": "Gourav Sharma",
  "email": "gourav@example.com",
  "country": "India",
  "accountType": "normal",
  "isPrivate": false,
  "followersCount": 150,
  "followingCount": 82,
  "postCount": 21
}
```

---

# Design Decisions

### Why store cached counters?

Counting followers or posts on every profile request would require multiple database queries. Cached counters provide much faster reads.

---

### Why store only Interest IDs?

MongoDB references avoid duplicating interest documents and allow multiple users to reference the same interest.

---

### Why is `refreshToken` stored?

The refresh token is stored to allow users to obtain a new access token without requiring them to log in again.

Access tokens have a short expiration time for security purposes. When an access token expires, the client sends the refresh token to the server to request a new access token.

The server verifies that the refresh token is valid and matches the one stored for the user. If it is valid, a new access token and  a new refresh token is generated and returned to the client.

The stored refresh token is also used to:

- Revoke user sessions during logout.
- Invalidate compromised or expired refresh tokens.
- Support refresh token rotation by replacing the old refresh token with a newly generated one after a successful refresh request.

During logout, the stored refresh token is removed from the database, preventing it from being used to obtain new access tokens.

### Why is password hidden?

The password field uses:

```javascript
select: false
```

to ensure it is never returned accidentally during queries.

---

