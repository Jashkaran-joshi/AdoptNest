# Pet Adoption Flow

## 🔄 Complete Adoption Process

### Step 1: Browse Pets
```
User visits /adopt
  ↓
Frontend: GET /api/pets
  ↓
Backend: petController.getPets()
  ↓
Service: petService.getPets(filters)
  ↓
Database: Pet.find(query)
  ↓
Return pets list
  ↓
Frontend displays pet cards
```

### Step 2: View Pet Details
```
User clicks pet card
  ↓
Navigate to /adopt/:id
  ↓
Frontend: GET /api/pets/:id
  ↓
Backend: petController.getPet()
  ↓
Service: petService.getPetById(id)
  ↓
Database: Pet.findById(id)
  ↓
Return pet details
  ↓
Frontend displays pet details page
```

### Step 3: Start Adoption Application
```
User clicks "Adopt" button
  ↓
Check if user is logged in
  ↓
Not logged in? → Redirect to /login
  ↓
Logged in? → Navigate to /adopt/apply/:id
```

### Step 4: Fill Adoption Form
```
User fills adoption form
  ↓
Form fields:
  - Name, Email, Phone
  - Address, City
  - Experience with pets
  - Reason for adoption
  - Home type, Yard
  - Hours alone
  - Other pets info
  ↓
User submits form
```

### Step 5: Submit Application
```
Frontend: POST /api/adoptions
  ↓
Body: Adoption application data + petId
  ↓
Backend: adoptionController.createAdoption()
  ↓
Middleware: protect (verify user)
  ↓
Validation: adoptionSchema validation
  ↓
Controller: Verify pet exists
  ↓
Controller: Add applicantId (from req.user)
  ↓
Database: Adoption.create(data)
  ↓
Return adoption object
  ↓
Frontend shows success message
```

### Step 6: Admin Review
```
Admin views adoption in dashboard
  ↓
Admin: GET /api/adoptions
  ↓
Backend returns all adoptions
  ↓
Admin reviews application
  ↓
Admin updates status: PATCH /api/adoptions/:id
  ↓
Status options: Pending, Approved, Rejected, Cancelled
  ↓
If Approved: Update pet status to "Adopted"
```

### Step 7: User Notification
```
User checks dashboard
  ↓
Frontend: GET /api/adoptions
  ↓
Backend returns user's adoptions
  ↓
Frontend displays status
  ↓
User sees approval/rejection
```

## 📊 Data Flow

### Adoption Object Structure
```javascript
{
  petId: ObjectId,
  applicantId: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  experience: String,
  reason: String,
  otherPets: Boolean,
  homeType: String,
  yard: Boolean,
  hoursAlone: String,
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled',
  notes: String
}
```

## 🔐 Authorization

- **Submit Application**: Any authenticated user
- **View Own Applications**: User can see their own
- **View All Applications**: Admin only
- **Update Status**: Admin only

---

**Next**: See [Booking Flow](./booking.md).

