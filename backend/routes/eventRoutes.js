const express = require('express');
const { Op } = require('sequelize');
const Event = require('../models/Event');

const router = express.Router();

// Helper: validate UUID format
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// @route   GET /api/events
// @desc    Fetch all events with search & filtering (search, category, city, industry, status)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, city, industry, status } = req.query;
    const whereConditions = {};

    // Search filter across name, venue, city, description, and industry using Op.iLike
    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { city: { [Op.iLike]: searchTerm } },
        { venue: { [Op.iLike]: searchTerm } },
        { country: { [Op.iLike]: searchTerm } },
        { industry: { [Op.iLike]: searchTerm } },
        { description: { [Op.iLike]: searchTerm } },
      ];
    }

    // Category filter using Op.iLike
    if (category && category.trim() !== '') {
      whereConditions.category = { [Op.iLike]: `%${category.trim()}%` };
    }

    // City filter using Op.iLike
    if (city && city.trim() !== '') {
      whereConditions.city = { [Op.iLike]: `%${city.trim()}%` };
    }

    // Industry filter using Op.iLike
    if (industry && industry.trim() !== '') {
      whereConditions.industry = { [Op.iLike]: `%${industry.trim()}%` };
    }

    // Status filter
    if (status && status.trim() !== '') {
      whereConditions.status = status.trim().toUpperCase();
    }

    const events = await Event.findAll({
      where: whereConditions,
      order: [['startDate', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message,
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get a single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format. Expected a valid UUID.',
      });
    }

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error(`Error fetching event ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch event details',
      error: error.message,
    });
  }
});

// @route   POST /api/events
// @desc    Create a new event with input validation
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      industry,
      startDate,
      endDate,
      venue,
      city,
      country,
      organizer,
      website,
      image,
      status,
    } = req.body;

    // Field presence validation
    const requiredFields = [
      'name',
      'description',
      'category',
      'industry',
      'startDate',
      'endDate',
      'venue',
      'city',
      'country',
      'organizer',
      'website',
      'image',
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field] || String(req.body[field]).trim() === '');
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(', ')}`,
      });
    }

    // Date validation
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate format. Please provide a valid ISO-8601 date string.',
      });
    }

    if (isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate format. Please provide a valid ISO-8601 date string.',
      });
    }

    if (parsedEndDate < parsedStartDate) {
      return res.status(400).json({
        success: false,
        message: 'endDate cannot be before startDate',
      });
    }

    // Status validation if provided
    const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const newEvent = await Event.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      industry: industry.trim(),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      venue: venue.trim(),
      city: city.trim(),
      country: country.trim(),
      organizer: organizer.trim(),
      website: website.trim(),
      image: image.trim(),
      status: status ? status.toUpperCase() : 'UPCOMING',
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map((e) => e.message),
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message,
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an existing event by ID
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format. Expected a valid UUID.',
      });
    }

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${id} not found`,
      });
    }

    const {
      name,
      description,
      category,
      industry,
      startDate,
      endDate,
      venue,
      city,
      country,
      organizer,
      website,
      image,
      status,
    } = req.body;

    // Date validations if updated
    const finalStartDate = startDate ? new Date(startDate) : new Date(event.startDate);
    const finalEndDate = endDate ? new Date(endDate) : new Date(event.endDate);

    if (startDate && isNaN(finalStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate format.',
      });
    }

    if (endDate && isNaN(finalEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate format.',
      });
    }

    if (finalEndDate < finalStartDate) {
      return res.status(400).json({
        success: false,
        message: 'endDate cannot be before startDate',
      });
    }

    // Status validation if updated
    const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    await event.update({
      name: name !== undefined ? name.trim() : event.name,
      description: description !== undefined ? description.trim() : event.description,
      category: category !== undefined ? category.trim() : event.category,
      industry: industry !== undefined ? industry.trim() : event.industry,
      startDate: startDate ? finalStartDate : event.startDate,
      endDate: endDate ? finalEndDate : event.endDate,
      venue: venue !== undefined ? venue.trim() : event.venue,
      city: city !== undefined ? city.trim() : event.city,
      country: country !== undefined ? country.trim() : event.country,
      organizer: organizer !== undefined ? organizer.trim() : event.organizer,
      website: website !== undefined ? website.trim() : event.website,
      image: image !== undefined ? image.trim() : event.image,
      status: status ? status.toUpperCase() : event.status,
    });

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    console.error(`Error updating event ${req.params.id}:`, error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map((e) => e.message),
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message,
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format. Expected a valid UUID.',
      });
    }

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID ${id} not found`,
      });
    }

    await event.destroy();

    return res.status(200).json({
      success: true,
      message: `Event '${event.name}' (ID: ${id}) deleted successfully`,
    });
  } catch (error) {
    console.error(`Error deleting event ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message,
    });
  }
});

module.exports = router;
