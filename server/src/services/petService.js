const Pet = require('../models/Pet');
const { deleteOldImage } = require('../utils/imageManager');

class PetService {
  async getPets(filters = {}) {
    try {
      const {
        type,
        age,
        location,
        search,
        status,
        page = 1,
        limit = 12
      } = filters;

      // Build query
      const query = {};

      if (type && type !== 'All') {
        query.type = type;
      }

      if (age && age !== 'Any') {
        query.ageGroup = age;
      }

      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }

      if (status) {
        query.status = status;
      } else {
        // Default to available pets
        query.status = { $in: ['Available', 'Pending'] };
      }

      // Only use text search if search index exists
      if (search) {
        try {
          query.$text = { $search: search };
        } catch (textError) {
          // If text index doesn't exist, use regex search instead
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }
      }

      // Pagination
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
      const skip = (pageNum - 1) * limitNum;

      // Execute query
      const pets = await Pet.find(query)
        .sort(search && query.$text ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(); // Use lean() for better performance

      const total = await Pet.countDocuments(query);
      const totalPages = Math.ceil((total || 0) / limitNum);

      // Handle edge case: if requested page exceeds available pages, return empty array
      // Frontend will handle redirecting to last valid page
      if (pageNum > totalPages && totalPages > 0) {
        return {
          pets: [],
          total: total || 0,
          page: pageNum,
          pages: totalPages
        };
      }

      return {
        pets: pets || [],
        total: total || 0,
        page: pageNum,
        pages: totalPages
      };
    } catch (error) {
      console.error('Get pets service error:', error);
      throw error;
    }
  }

  async getPetById(id) {
    const pet = await Pet.findById(id);
    if (!pet) {
      throw new Error('NOT_FOUND');
    }
    return pet;
  }

  async createPet(petData, userId) {
    petData.createdBy = userId;
    const pet = await Pet.create(petData);
    return pet;
  }

  async updatePet(id, petData) {
    const pet = await Pet.findById(id);
    if (!pet) {
      throw new Error('NOT_FOUND');
    }

    const updatedPet = await Pet.findByIdAndUpdate(id, petData, {
      new: true,
      runValidators: true
    });

    return updatedPet;
  }

  async deletePet(id) {
    const pet = await Pet.findById(id);
    if (!pet) {
      throw new Error('NOT_FOUND');
    }

    // Delete associated image
    if (pet.image) {
      deleteOldImage(pet.image);
    }

    await Pet.findByIdAndDelete(id);
    return { message: 'Pet deleted successfully' };
  }
}

module.exports = new PetService();

