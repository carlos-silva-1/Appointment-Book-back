const asyncHandler = require('express-async-handler')
const Appointment = require('../models/appointmentModel')
const User = require('../models/userModel')

// @desc    Get appointments
// @route   GET /api/appointment
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user.id })

  res.status(200).json(appointments)
})

// @desc    Set appointment
// @route   POST /api/appointments
// @access  Private
const setAppointment = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  const appointment = await Appointment.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json(appointment)
})

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)

  if (!appointment) {
    res.status(400)
    throw new Error('Appointment not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the appointment user
  if (appointment.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedAppointment)
})

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)

  if (!appointment) {
    res.status(400)
    throw new Error('appointment not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the appointment user
  if (appointment.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await appointment.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getAppointments,
  setAppointment,
  updateAppointment,
  deleteAppointment,
}
