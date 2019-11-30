import sequelize from '../config/init-db';

const User = sequelize.import('./User');
const Clipping = sequelize.import('./Clipping');
const File = sequelize.import('./File');

User.hasMany(Clipping, { as: 'Clippings' });

User.hasMany(File, { as: 'Files' });
File.hasMany(Clipping, { as: 'Clippings' });

sequelize.sync();

export { User, Clipping, File, sequelize };
