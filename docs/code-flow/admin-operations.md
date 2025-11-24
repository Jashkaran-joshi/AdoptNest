# Admin Operations Flow

## 👨‍💼 Admin Dashboard Flow

### Step 1: Access Admin Dashboard
```
Admin logs in
  ↓
Frontend: Check user.isAdmin
  ↓
Navigate to /admin
  ↓
Frontend: GET /api/admin/stats
  ↓
Backend: adminController.getStats()
  ↓
Middleware: protect, authorize('admin')
  ↓
Calculate statistics:
  - Total users
  - Total pets
  - Pending adoptions
  - Recent activities
  ↓
Return: Statistics object
  ↓
Frontend displays dashboard
```

### Step 2: Manage Pets
```
Admin clicks "Add Pet"
  ↓
Navigate to /admin/add
  ↓
Admin fills pet form with image
  ↓
Submit: POST /api/pets
  ↓
Backend: petController.createPet()
  ↓
Middleware: protect, authorize('admin')
  ↓
Multer: Handle image upload
  ↓
Validation: petSchema
  ↓
Create pet in database
  ↓
Return: Pet object
  ↓
Frontend refreshes pet list
```

### Step 3: Manage Users
```
Admin visits /admin/users
  ↓
Frontend: GET /api/admin/users
  ↓
Backend: adminController.getUsers()
  ↓
Middleware: protect, authorize('admin')
  ↓
Database: User.find()
  ↓
Return: Users array
  ↓
Admin can:
  - View users
  - Update role (user/admin)
  - Update status (active/suspended)
  - Search users
```

### Step 4: Review Adoptions
```
Admin views adoptions
  ↓
Frontend: GET /api/adoptions
  ↓
Backend: adoptionController.getAdoptions()
  ↓
Middleware: protect, authorize('admin')
  ↓
Database: Adoption.find().populate()
  ↓
Return: All adoptions
  ↓
Admin reviews application
  ↓
Admin updates status: PATCH /api/adoptions/:id
  ↓
Status: Approved → Pet status updated to "Adopted"
```

### Step 5: Manage Content
```
Admin manages:
  - Blog posts: CRUD operations
  - Success stories: CRUD operations
  - Contact messages: View and mark as read
  - Volunteers: Review and approve
  - Donation contacts: Manage
```

## 🔐 Admin Authorization

### Admin Check
```javascript
// Middleware
authorize('admin')

// Controller
if (req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Forbidden' });
}
```

### Admin Routes
All `/api/admin/*` routes require admin role.

---

**Next**: Return to [Main Documentation](../README.md).

