import { useState } from "react";
import { InputField, SelectField, TextareaField, FormRow, FormActions } from "./FormField";
import superAdminAPI from "../services/superAdminAPI";

// ─── CREATE USER FORM ─────────────────────────────────────────────────────────
export function CreateUserForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "member",
    branch: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Call the backend API to create user
      const response = await superAdminAPI.users.createUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        branch: formData.branch || null,
        password: 'TempPassword@123', // Default password
        gender: 'other',
        age: 18,
      });
      
      console.log('[CreateUserForm] User created successfully:', response);
      setLoading(false);
      // Only call onSubmit if creation was successful
      onSubmit(response);
    } catch (error) {
      console.error('[CreateUserForm] Error creating user:', error);
      setLoading(false);
      // Extract error message from response or use default
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create user';
      setErrors({ submit: errorMessage });
    }
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>
          {errors.submit}
        </div>
      )}
      <InputField
        label="Full Name"
        required
        value={formData.fullName}
        onChange={(e) => set("fullName", e.target.value)}
        error={errors.fullName}
        placeholder="Enter full name"
      />
      <FormRow>
        <InputField
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
          placeholder="user@example.com"
        />
        <InputField
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </FormRow>
      <FormRow>
        <SelectField
          label="Role"
          required
          value={formData.role}
          onChange={(e) => set("role", e.target.value)}
          error={errors.role}
          placeholder="Select role"
          options={["member", "trainer", "admin", "superadmin"]}
        />
        <InputField
          label="Branch"
          value={formData.branch}
          onChange={(e) => set("branch", e.target.value)}
          placeholder="Branch name"
        />
      </FormRow>
      <FormActions onCancel={onCancel} submitLabel="Create User" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── CREATE PLAN FORM ─────────────────────────────────────────────────────────
export function CreatePlanForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    features: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Plan name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Plan Name"
        required
        value={formData.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
        placeholder="e.g., Premium Membership"
      />
      <FormRow>
        <InputField
          label="Price"
          type="number"
          required
          value={formData.price}
          onChange={(e) => set("price", e.target.value)}
          error={errors.price}
          placeholder="99.99"
        />
        <SelectField
          label="Duration"
          required
          value={formData.duration}
          onChange={(e) => set("duration", e.target.value)}
          error={errors.duration}
          placeholder="Select duration"
          options={["Monthly", "Quarterly", "Half-Yearly", "Annual"]}
        />
      </FormRow>
      <TextareaField
        label="Description"
        value={formData.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="Brief description of the plan"
      />
      <TextareaField
        label="Features"
        value={formData.features}
        onChange={(e) => set("features", e.target.value)}
        placeholder="List key features (one per line)"
        rows={4}
      />
      <FormActions onCancel={onCancel} submitLabel="Create Plan" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── ADD EQUIPMENT FORM ───────────────────────────────────────────────────────
export function AddEquipmentForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    status: "",
    location: "",
    purchaseDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Equipment name is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Equipment Name"
        required
        value={formData.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
        placeholder="e.g., Treadmill Pro X5"
      />
      <FormRow>
        <SelectField
          label="Category"
          value={formData.category}
          onChange={(e) => set("category", e.target.value)}
          placeholder="Select category"
          options={["Cardio", "Strength", "Free Weights", "Accessories", "Other"]}
        />
        <InputField
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => set("quantity", e.target.value)}
          placeholder="1"
        />
      </FormRow>
      <FormRow>
        <SelectField
          label="Status"
          required
          value={formData.status}
          onChange={(e) => set("status", e.target.value)}
          error={errors.status}
          placeholder="Select status"
          options={["operational", "maintenance", "out_of_order"]}
        />
        <InputField
          label="Location"
          value={formData.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="e.g., Floor 2, Zone A"
        />
      </FormRow>
      <InputField
        label="Purchase Date"
        type="date"
        value={formData.purchaseDate}
        onChange={(e) => set("purchaseDate", e.target.value)}
      />
      <TextareaField
        label="Notes"
        value={formData.notes}
        onChange={(e) => set("notes", e.target.value)}
        placeholder="Additional notes or maintenance history"
      />
      <FormActions onCancel={onCancel} submitLabel="Add Equipment" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── ADD VENDOR FORM ──────────────────────────────────────────────────────────
export function AddVendorForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    category: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vendor name is required";
    if (!formData.contact.trim()) newErrors.contact = "Contact person is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Vendor Name"
        required
        value={formData.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
        placeholder="e.g., FitEquip Supplies"
      />
      <InputField
        label="Contact Person"
        required
        value={formData.contact}
        onChange={(e) => set("contact", e.target.value)}
        error={errors.contact}
        placeholder="Contact name"
      />
      <FormRow>
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="vendor@example.com"
        />
        <InputField
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </FormRow>
      <SelectField
        label="Category"
        value={formData.category}
        onChange={(e) => set("category", e.target.value)}
        placeholder="Select category"
        options={["Equipment", "Supplements", "Maintenance", "Cleaning", "Other"]}
      />
      <TextareaField
        label="Address"
        value={formData.address}
        onChange={(e) => set("address", e.target.value)}
        placeholder="Full address"
        rows={2}
      />
      <TextareaField
        label="Notes"
        value={formData.notes}
        onChange={(e) => set("notes", e.target.value)}
        placeholder="Additional information"
      />
      <FormActions onCancel={onCancel} submitLabel="Add Vendor" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── CREATE CAMPAIGN FORM ─────────────────────────────────────────────────────
export function CreateCampaignForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    discount: "",
    startDate: "",
    endDate: "",
    target: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Campaign title is required";
    if (!formData.type) newErrors.type = "Campaign type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Campaign Title"
        required
        value={formData.title}
        onChange={(e) => set("title", e.target.value)}
        error={errors.title}
        placeholder="e.g., Summer Fitness Sale"
      />
      <FormRow>
        <SelectField
          label="Type"
          required
          value={formData.type}
          onChange={(e) => set("type", e.target.value)}
          error={errors.type}
          placeholder="Select type"
          options={["email", "sms", "push", "in-app"]}
        />
        <InputField
          label="Discount %"
          type="number"
          value={formData.discount}
          onChange={(e) => set("discount", e.target.value)}
          placeholder="20"
        />
      </FormRow>
      <FormRow>
        <InputField
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => set("startDate", e.target.value)}
        />
        <InputField
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(e) => set("endDate", e.target.value)}
        />
      </FormRow>
      <SelectField
        label="Target Audience"
        value={formData.target}
        onChange={(e) => set("target", e.target.value)}
        placeholder="Select target"
        options={["All Members", "Active Members", "Inactive Members", "New Members", "Premium Members"]}
      />
      <TextareaField
        label="Message"
        value={formData.message}
        onChange={(e) => set("message", e.target.value)}
        placeholder="Campaign message content"
        rows={4}
      />
      <FormActions onCancel={onCancel} submitLabel="Create Campaign" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── ADD MEMBER FORM ──────────────────────────────────────────────────────────
export function AddMemberForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "",
    gender: "",
    age: "",
    emergencyContact: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.plan) newErrors.plan = "Membership plan is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Full Name"
        required
        value={formData.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
        placeholder="Enter full name"
      />
      <FormRow>
        <InputField
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
          placeholder="member@example.com"
        />
        <InputField
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </FormRow>
      <FormRow>
        <SelectField
          label="Membership Plan"
          required
          value={formData.plan}
          onChange={(e) => set("plan", e.target.value)}
          error={errors.plan}
          placeholder="Select plan"
          options={["Monthly", "Quarterly", "Half-Yearly", "Annual"]}
        />
        <SelectField
          label="Gender"
          value={formData.gender}
          onChange={(e) => set("gender", e.target.value)}
          placeholder="Select gender"
          options={["Male", "Female", "Other", "Prefer not to say"]}
        />
      </FormRow>
      <FormRow>
        <InputField
          label="Age"
          type="number"
          value={formData.age}
          onChange={(e) => set("age", e.target.value)}
          placeholder="25"
        />
        <InputField
          label="Emergency Contact"
          type="tel"
          value={formData.emergencyContact}
          onChange={(e) => set("emergencyContact", e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </FormRow>
      <FormActions onCancel={onCancel} submitLabel="Add Member" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── ADD STAFF FORM ───────────────────────────────────────────────────────────
export function AddStaffForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    specialization: "",
    experience: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Full Name"
        required
        value={formData.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
        placeholder="Enter full name"
      />
      <FormRow>
        <InputField
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
          placeholder="staff@example.com"
        />
        <InputField
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </FormRow>
      <SelectField
        label="Role"
        required
        value={formData.role}
        onChange={(e) => set("role", e.target.value)}
        error={errors.role}
        placeholder="Select role"
        options={["Trainer", "Senior Trainer", "Cardio Specialist", "Yoga Instructor", "Reception"]}
      />
      <InputField
        label="Specialization"
        value={formData.specialization}
        onChange={(e) => set("specialization", e.target.value)}
        placeholder="e.g., Yoga & Pilates"
      />
      <InputField
        label="Experience (years)"
        type="number"
        value={formData.experience}
        onChange={(e) => set("experience", e.target.value)}
        placeholder="5"
      />
      <FormActions onCancel={onCancel} submitLabel="Add Staff" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── CREATE BRANCH FORM ───────────────────────────────────────────────────────
export function CreateBranchForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    branchName: "",
    branchCode: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
    contactNumber: "",
    email: "",
    openingTime: "06:00",
    closingTime: "22:00",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.branchName.trim()) newErrors.branchName = "Branch name is required";
    if (!formData.branchCode.trim()) newErrors.branchCode = "Branch code is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[0-9]{5,6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 5-6 digits";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    else {
      const cleanNumber = formData.contactNumber.replace(/\D/g, '');
      if (cleanNumber.length !== 10) newErrors.contactNumber = "Contact number must be 10 digits";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.openingTime) newErrors.openingTime = "Opening time is required";
    if (!formData.closingTime) newErrors.closingTime = "Closing time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Clean contact number - remove all non-digits
      const cleanContactNumber = formData.contactNumber.replace(/\D/g, '');
      
      // Call the backend API to create branch
      const response = await superAdminAPI.branches.createBranch({
        branchName: formData.branchName,
        branchCode: formData.branchCode,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        pincode: formData.pincode,
        contactNumber: cleanContactNumber,
        email: formData.email,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        branchStatus: 'active',
      });
      
      console.log('[CreateBranchForm] Branch created successfully:', response);
      setLoading(false);
      // Only call onSubmit if creation was successful
      onSubmit(response);
    } catch (error) {
      console.error('[CreateBranchForm] Error creating branch:', error);
      setLoading(false);
      // Extract error message from response or use default
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create branch';
      setErrors({ submit: errorMessage });
    }
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "12px" }}>
          {errors.submit}
        </div>
      )}
      <FormRow>
        <InputField
          label="Branch Name"
          required
          value={formData.branchName}
          onChange={(e) => set("branchName", e.target.value)}
          error={errors.branchName}
          placeholder="e.g., FitZone Downtown"
        />
        <InputField
          label="Branch Code"
          required
          value={formData.branchCode}
          onChange={(e) => set("branchCode", e.target.value.toUpperCase())}
          error={errors.branchCode}
          placeholder="e.g., FZ-DT-001"
        />
      </FormRow>
      <TextareaField
        label="Address"
        required
        value={formData.address}
        onChange={(e) => set("address", e.target.value)}
        error={errors.address}
        placeholder="Full address"
        rows={2}
      />
      <FormRow>
        <InputField
          label="City"
          required
          value={formData.city}
          onChange={(e) => set("city", e.target.value)}
          error={errors.city}
          placeholder="City name"
        />
        <InputField
          label="State"
          required
          value={formData.state}
          onChange={(e) => set("state", e.target.value)}
          error={errors.state}
          placeholder="State name"
        />
      </FormRow>
      <FormRow>
        <InputField
          label="Pincode"
          required
          value={formData.pincode}
          onChange={(e) => set("pincode", e.target.value)}
          error={errors.pincode}
          placeholder="e.g., 110001"
        />
        <InputField
          label="Contact Number"
          type="tel"
          required
          value={formData.contactNumber}
          onChange={(e) => set("contactNumber", e.target.value)}
          error={errors.contactNumber}
          placeholder="10-digit number (e.g., 9876543210)"
        />
      </FormRow>
      <InputField
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => set("email", e.target.value)}
        error={errors.email}
        placeholder="branch@example.com"
      />
      <FormRow>
        <InputField
          label="Opening Time"
          type="time"
          required
          value={formData.openingTime}
          onChange={(e) => set("openingTime", e.target.value)}
          error={errors.openingTime}
        />
        <InputField
          label="Closing Time"
          type="time"
          required
          value={formData.closingTime}
          onChange={(e) => set("closingTime", e.target.value)}
          error={errors.closingTime}
        />
      </FormRow>
      <FormActions onCancel={onCancel} submitLabel="Create Branch" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── FORM RENDERER ────────────────────────────────────────────────────────────
export function FormRenderer({ formType, onSubmit, onCancel, accentColor, data = {} }) {
  const forms = {
    createUser: <CreateUserForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    createPlan: <CreatePlanForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    addEquipment: <AddEquipmentForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    addVendor: <AddVendorForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    createCampaign: <CreateCampaignForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    addMember: <AddMemberForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    addStaff: <AddStaffForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    createBranch: <CreateBranchForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    addClass: <AddClassForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    assignPlan: <AssignPlanForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} clients={data.clients} plans={data.plans} />,
    addDietPlan: <AddDietPlanForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} clients={data.clients} />,
    logMeal: <LogMealForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} clients={data.clients} />,
    scheduleMaintenance: <ScheduleMaintenanceForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    createTicket: <CreateTicketForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    addFeatureFlag: <AddFeatureFlagForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
    newContent: <NewContentForm onSubmit={onSubmit} onCancel={onCancel} accentColor={accentColor} />,
  };

  return forms[formType] || <div>Form not found</div>;
}

export const formTitles = {
  createUser: "Create New User",
  createPlan: "Create Membership Plan",
  addEquipment: "Add Equipment",
  addVendor: "Add Vendor",
  createCampaign: "Create Campaign",
  addMember: "Add New Member",
  addStaff: "Add Staff Member",
  createBranch: "Create New Branch",
  addClass: "Add New Class",
  assignPlan: "Assign Workout Plan",
  addDietPlan: "Create Diet Plan",
  logMeal: "Log Meal",
  scheduleMaintenance: "Schedule Maintenance",
  createTicket: "Create Support Ticket",
  addFeatureFlag: "Add Feature Flag",
  newContent: "New Content",
};

// ─── ADD CLASS FORM ───────────────────────────────────────────────────────────
export function AddClassForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    schedule: "",
    duration: "",
    capacity: "",
    level: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Class name is required";
    if (!formData.schedule.trim()) newErrors.schedule = "Schedule is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Class Name"
        required
        value={formData.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
        placeholder="e.g., HIIT Blast"
      />
      <FormRow>
        <InputField
          label="Instructor"
          value={formData.instructor}
          onChange={(e) => set("instructor", e.target.value)}
          placeholder="Instructor name"
        />
        <SelectField
          label="Level"
          value={formData.level}
          onChange={(e) => set("level", e.target.value)}
          placeholder="Select level"
          options={["Beginner", "Intermediate", "Advanced", "All Levels"]}
        />
      </FormRow>
      <FormRow>
        <InputField
          label="Schedule"
          required
          value={formData.schedule}
          onChange={(e) => set("schedule", e.target.value)}
          error={errors.schedule}
          placeholder="e.g., Mon/Wed/Fri 6:00 AM"
        />
        <InputField
          label="Duration (min)"
          type="number"
          value={formData.duration}
          onChange={(e) => set("duration", e.target.value)}
          placeholder="60"
        />
      </FormRow>
      <InputField
        label="Capacity"
        type="number"
        value={formData.capacity}
        onChange={(e) => set("capacity", e.target.value)}
        placeholder="Max participants"
      />
      <TextareaField
        label="Description"
        value={formData.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="Class description"
      />
      <FormActions onCancel={onCancel} submitLabel="Add Class" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── ASSIGN PLAN FORM ─────────────────────────────────────────────────────────
export function AssignPlanForm({ onSubmit, onCancel, accentColor, clients = [], plans = [] }) {
  const [formData, setFormData] = useState({
    client: "",
    plan: "",
    startDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.client) newErrors.client = "Client is required";
    if (!formData.plan) newErrors.plan = "Plan is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <SelectField
        label="Client"
        required
        value={formData.client}
        onChange={(e) => set("client", e.target.value)}
        error={errors.client}
        placeholder="Select client"
        options={clients.length > 0 ? clients.map(c => ({ value: c.id, label: c.name })) : ["Aryan Mehta", "Priya Sharma", "Rahul Gupta", "Neha Joshi"]}
      />
      <SelectField
        label="Workout Plan"
        required
        value={formData.plan}
        onChange={(e) => set("plan", e.target.value)}
        error={errors.plan}
        placeholder="Select plan"
        options={plans.length > 0 ? plans.map(p => ({ value: p.id, label: p.name })) : ["Beginner Full Body", "Intermediate Strength", "Weight Loss Circuit", "Advanced CrossFit"]}
      />
      <InputField
        label="Start Date"
        type="date"
        value={formData.startDate}
        onChange={(e) => set("startDate", e.target.value)}
      />
      <TextareaField
        label="Notes"
        value={formData.notes}
        onChange={(e) => set("notes", e.target.value)}
        placeholder="Additional notes for this assignment"
      />
      <FormActions onCancel={onCancel} submitLabel="Assign Plan" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── ADD DIET PLAN FORM ───────────────────────────────────────────────────────
export function AddDietPlanForm({ onSubmit, onCancel, accentColor, clients = [] }) {
  const [formData, setFormData] = useState({
    client: "",
    goal: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.client) newErrors.client = "Client is required";
    if (!formData.goal) newErrors.goal = "Goal is required";
    if (!formData.calories) newErrors.calories = "Calories is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <SelectField
        label="Client"
        required
        value={formData.client}
        onChange={(e) => set("client", e.target.value)}
        error={errors.client}
        placeholder="Select client"
        options={clients.length > 0 ? clients.map(c => ({ value: c.id, label: c.name })) : ["Aryan Mehta", "Priya Sharma", "Rahul Gupta", "Neha Joshi"]}
      />
      <SelectField
        label="Goal"
        required
        value={formData.goal}
        onChange={(e) => set("goal", e.target.value)}
        error={errors.goal}
        placeholder="Select goal"
        options={["Muscle Gain", "Fat Loss", "Weight Loss", "Performance", "Maintenance"]}
      />
      <InputField
        label="Daily Calories (kcal)"
        type="number"
        required
        value={formData.calories}
        onChange={(e) => set("calories", e.target.value)}
        error={errors.calories}
        placeholder="2000"
      />
      <FormRow>
        <InputField
          label="Protein (g)"
          type="number"
          value={formData.protein}
          onChange={(e) => set("protein", e.target.value)}
          placeholder="150"
        />
        <InputField
          label="Carbs (g)"
          type="number"
          value={formData.carbs}
          onChange={(e) => set("carbs", e.target.value)}
          placeholder="200"
        />
      </FormRow>
      <InputField
        label="Fat (g)"
        type="number"
        value={formData.fat}
        onChange={(e) => set("fat", e.target.value)}
        placeholder="65"
      />
      <TextareaField
        label="Notes"
        value={formData.notes}
        onChange={(e) => set("notes", e.target.value)}
        placeholder="Dietary restrictions, preferences, etc."
      />
      <FormActions onCancel={onCancel} submitLabel="Create Diet Plan" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── LOG MEAL FORM ────────────────────────────────────────────────────────────
export function LogMealForm({ onSubmit, onCancel, accentColor, clients = [] }) {
  const [formData, setFormData] = useState({
    client: "",
    meal: "",
    food: "",
    calories: "",
    protein: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.client) newErrors.client = "Client is required";
    if (!formData.meal) newErrors.meal = "Meal type is required";
    if (!formData.food.trim()) newErrors.food = "Food description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <FormRow>
        <SelectField
          label="Client"
          required
          value={formData.client}
          onChange={(e) => set("client", e.target.value)}
          error={errors.client}
          placeholder="Select client"
          options={clients.length > 0 ? clients.map(c => ({ value: c.id, label: c.name })) : ["Aryan Mehta", "Priya Sharma", "Rahul Gupta", "Neha Joshi"]}
        />
        <SelectField
          label="Meal Type"
          required
          value={formData.meal}
          onChange={(e) => set("meal", e.target.value)}
          error={errors.meal}
          placeholder="Select meal"
          options={["Breakfast", "Lunch", "Dinner", "Snack", "Pre-Workout", "Post-Workout"]}
        />
      </FormRow>
      <InputField
        label="Food Description"
        required
        value={formData.food}
        onChange={(e) => set("food", e.target.value)}
        error={errors.food}
        placeholder="e.g., Oats + Eggs + Banana"
      />
      <FormRow>
        <InputField
          label="Calories (kcal)"
          type="number"
          value={formData.calories}
          onChange={(e) => set("calories", e.target.value)}
          placeholder="500"
        />
        <InputField
          label="Protein (g)"
          type="number"
          value={formData.protein}
          onChange={(e) => set("protein", e.target.value)}
          placeholder="30"
        />
      </FormRow>
      <InputField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => set("date", e.target.value)}
      />
      <FormActions onCancel={onCancel} submitLabel="Log Meal" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── SCHEDULE MAINTENANCE FORM ────────────────────────────────────────────────
export function ScheduleMaintenanceForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    equipment: "",
    type: "",
    scheduledDate: "",
    technician: "",
    priority: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.equipment.trim()) newErrors.equipment = "Equipment name is required";
    if (!formData.scheduledDate) newErrors.scheduledDate = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Equipment Name"
        required
        value={formData.equipment}
        onChange={(e) => set("equipment", e.target.value)}
        error={errors.equipment}
        placeholder="e.g., Treadmill #3"
      />
      <FormRow>
        <SelectField
          label="Maintenance Type"
          value={formData.type}
          onChange={(e) => set("type", e.target.value)}
          placeholder="Select type"
          options={["Routine Service", "Repair", "Inspection", "Replacement", "Cleaning"]}
        />
        <SelectField
          label="Priority"
          value={formData.priority}
          onChange={(e) => set("priority", e.target.value)}
          placeholder="Select priority"
          options={["low", "medium", "high", "urgent"]}
        />
      </FormRow>
      <FormRow>
        <InputField
          label="Scheduled Date"
          type="date"
          required
          value={formData.scheduledDate}
          onChange={(e) => set("scheduledDate", e.target.value)}
          error={errors.scheduledDate}
        />
        <InputField
          label="Technician"
          value={formData.technician}
          onChange={(e) => set("technician", e.target.value)}
          placeholder="Technician name"
        />
      </FormRow>
      <TextareaField
        label="Notes"
        value={formData.notes}
        onChange={(e) => set("notes", e.target.value)}
        placeholder="Issue description or maintenance details"
      />
      <FormActions onCancel={onCancel} submitLabel="Schedule Maintenance" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── CREATE SUPPORT TICKET FORM ───────────────────────────────────────────────
export function CreateTicketForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    user: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Subject"
        required
        value={formData.subject}
        onChange={(e) => set("subject", e.target.value)}
        error={errors.subject}
        placeholder="Brief description of the issue"
      />
      <FormRow>
        <SelectField
          label="Category"
          value={formData.category}
          onChange={(e) => set("category", e.target.value)}
          placeholder="Select category"
          options={["Technical", "Billing", "Account", "Equipment", "General"]}
        />
        <SelectField
          label="Priority"
          value={formData.priority}
          onChange={(e) => set("priority", e.target.value)}
          placeholder="Select priority"
          options={["low", "medium", "high"]}
        />
      </FormRow>
      <InputField
        label="Reported By"
        value={formData.user}
        onChange={(e) => set("user", e.target.value)}
        placeholder="User name or email"
      />
      <TextareaField
        label="Description"
        required
        value={formData.description}
        onChange={(e) => set("description", e.target.value)}
        error={errors.description}
        placeholder="Detailed description of the issue"
        rows={4}
      />
      <FormActions onCancel={onCancel} submitLabel="Create Ticket" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── ADD FEATURE FLAG FORM ────────────────────────────────────────────────────
export function AddFeatureFlagForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    environment: "",
    description: "",
    enabled: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Flag name is required";
    if (!formData.key.trim()) newErrors.key = "Flag key is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Flag Name"
        required
        value={formData.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
        placeholder="e.g., New Dashboard UI"
      />
      <InputField
        label="Flag Key"
        required
        value={formData.key}
        onChange={(e) => set("key", e.target.value.toLowerCase().replace(/\s+/g, "_"))}
        error={errors.key}
        placeholder="e.g., new_dashboard_ui"
      />
      <SelectField
        label="Environment"
        value={formData.environment}
        onChange={(e) => set("environment", e.target.value)}
        placeholder="Select environment"
        options={["production", "beta", "alpha", "development"]}
      />
      <TextareaField
        label="Description"
        value={formData.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="What does this feature flag control?"
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div
          onClick={() => set("enabled", !formData.enabled)}
          style={{
            width: 40, height: 22, borderRadius: 11,
            background: formData.enabled ? "var(--accent)" : "var(--border-color)",
            cursor: "pointer", position: "relative", transition: "background .2s",
          }}
        >
          <div style={{
            position: "absolute", top: 3,
            left: formData.enabled ? 20 : 3,
            width: 16, height: 16, borderRadius: "50%",
            background: "#fff", transition: "left .2s",
          }} />
        </div>
        <span style={{ fontSize: ".85rem", color: "var(--text-primary)" }}>
          {formData.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>
      <FormActions onCancel={onCancel} submitLabel="Add Flag" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── NEW CONTENT FORM ─────────────────────────────────────────────────────────
export function NewContentForm({ onSubmit, onCancel, accentColor }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    status: "draft",
    body: "",
    tags: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Content type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setLoading(false);
  };

  const set = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Title"
        required
        value={formData.title}
        onChange={(e) => set("title", e.target.value)}
        error={errors.title}
        placeholder="Content title"
      />
      <FormRow>
        <SelectField
          label="Type"
          required
          value={formData.type}
          onChange={(e) => set("type", e.target.value)}
          error={errors.type}
          placeholder="Select type"
          options={["Blog", "Announcement", "Schedule", "Promotion", "News"]}
        />
        <SelectField
          label="Status"
          value={formData.status}
          onChange={(e) => set("status", e.target.value)}
          options={["draft", "published"]}
        />
      </FormRow>
      <TextareaField
        label="Content Body"
        value={formData.body}
        onChange={(e) => set("body", e.target.value)}
        placeholder="Write your content here..."
        rows={5}
      />
      <InputField
        label="Tags"
        value={formData.tags}
        onChange={(e) => set("tags", e.target.value)}
        placeholder="fitness, health, tips (comma separated)"
      />
      <FormActions onCancel={onCancel} submitLabel="Publish Content" loading={loading} accentColor={accentColor} />
    </form>
  );
}

// ─── EXTENDED FORM TITLES ─────────────────────────────────────────────────────
export const extendedFormTitles = {
  ...formTitles,
  addClass: "Add New Class",
  assignPlan: "Assign Workout Plan",
  addDietPlan: "Create Diet Plan",
  logMeal: "Log Meal",
  scheduleMaintenance: "Schedule Maintenance",
  createTicket: "Create Support Ticket",
  addFeatureFlag: "Add Feature Flag",
  newContent: "New Content",
};
