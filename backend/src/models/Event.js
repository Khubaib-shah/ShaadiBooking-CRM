const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['wedding', 'engagement', 'reception', 'corporate', 'birthday', 'other'],
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weddingPlannerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  endDate: Date,
  venue: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    capacity: Number,
    contactInfo: {
      phone: String,
      email: String
    }
  },
  guestCount: {
    type: Number,
    min: 1
  },
  budget: {
    total: Number,
    currency: { type: String, default: 'USD' },
    breakdown: [{
      category: String,
      amount: Number,
      description: String
    }]
  },
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'planning'
  },
  timeline: [{
    date: Date,
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  vendors: [{
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    service: String,
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'completed'],
      default: 'requested'
    },
    contract: {
      signed: { type: Boolean, default: false },
      signedDate: Date,
      terms: String
    },
    payment: {
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
      }
    }
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes
eventSchema.index({ customerId: 1 });
eventSchema.index({ weddingPlannerId: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ 'venue.city': 1 });
eventSchema.index({ tags: 1 });

// Virtual for duration
eventSchema.virtual('duration').get(function() {
  if (this.endDate) {
    return Math.ceil((this.endDate - this.date) / (1000 * 60 * 60 * 24));
  }
  return 1;
});

// Pre-save middleware to validate dates
eventSchema.pre('save', function(next) {
  if (this.endDate && this.endDate < this.date) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);