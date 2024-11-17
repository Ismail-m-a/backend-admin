'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Posts',
      [
        {
          id: '7bfc7f94-2d08-4afc-9c2c-60cd74fa8cd2',
          authorId: '2be56188-fc72-409e-abe8-c607cce9f2e6', 
          content: 'This is a sample post.',
          category: 'frontend',
          reported: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '12345678-90ab-cdef-1234-567890abcdef',
          authorId: '2be56188-fc72-409e-abe8-c607cce9f2e6',
          content: 'Another sample post for backend.',
          category: 'backend',
          reported: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
