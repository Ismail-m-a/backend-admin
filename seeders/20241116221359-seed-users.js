'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Seeding Users...');
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('securepassword', 10);

    await queryInterface.bulkInsert('Users', [
      {
        id: '11111111-1111-1111-1111-111111111111',
        username: 'Ismail',
        password: hashedPassword1,
        role: 'admin',
        grupp: 'backend-admin',
        field: 'IT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        username: 'user1',
        password: hashedPassword2,
        role: 'user',
        grupp: 'dev_group',
        field: 'Development',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}).then(() => {
      console.log('Users seeded successfully!');
    }).catch((error) => {
      console.error('Error while seeding Users:', error);
    });
  },

  async down(queryInterface, Sequelize) {
    console.log('Undoing Users seed...');
    await queryInterface.bulkDelete('Users', null, {});
    console.log('Users seed undone!');
  }
};
