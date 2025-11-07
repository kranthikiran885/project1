const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    res.json({ exists: !!existingUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.checkPhone = async (req, res) => {
  try {
    const { phone } = req.body
    if (!phone) {
      return res.status(400).json({ error: "Phone is required" })
    }

    const cleanPhone = phone.replace(/\D/g, "")
    const existingUser = await User.findOne({ 
      phone: { $regex: cleanPhone } 
    })
    res.json({ exists: !!existingUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.register = async (req, res) => {
  try {
    const { email, password, role, name, phone, rollNumber, collegeName, childName, childCollege, licenseNumber, vehicleNumber, employeeId, department } = req.body

    // Validate required fields
    if (!email || !password || !role || !name || !phone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { phone: phone.replace(/\D/g, "") }
      ]
    })
    
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email.toLowerCase() 
          ? "Email already registered" 
          : "Phone number already registered" 
      })
    }

    // Create user data object with role-specific fields
    const userData = {
      email: email.toLowerCase(),
      password,
      role,
      name,
      phone: phone.replace(/\D/g, ""),
      createdAt: new Date(),
      lastLogin: null,
    }

    // Add role-specific fields
    if (role === 'student') {
      userData.rollNumber = rollNumber
      userData.collegeName = collegeName
    } else if (role === 'parent') {
      userData.childName = childName
      userData.childCollege = childCollege
    } else if (role === 'driver') {
      userData.licenseNumber = licenseNumber
      userData.vehicleNumber = vehicleNumber
    } else if (role === 'admin') {
      userData.employeeId = employeeId
      userData.department = department
    }

    // Create new user
    const user = new User(userData)
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    )

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        rollNumber: user.rollNumber,
        collegeName: user.collegeName,
        childName: user.childName,
        childCollege: user.childCollege,
        licenseNumber: user.licenseNumber,
        vehicleNumber: user.vehicleNumber,
        employeeId: user.employeeId,
        department: user.department,
      },
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    res.status(500).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" })
    }

    // Find user by email and role
    const user = await User.findOne({
      email: email.toLowerCase(),
      role,
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        rollNumber: user.rollNumber,
        collegeName: user.collegeName,
        childName: user.childName,
        childCollege: user.childCollege,
        licenseNumber: user.licenseNumber,
        vehicleNumber: user.vehicleNumber,
        employeeId: user.employeeId,
        department: user.department,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    res.status(500).json({ error: error.message })
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, darkMode, notifications, biometricEnabled } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        darkMode,
        notifications,
        biometricEnabled,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
