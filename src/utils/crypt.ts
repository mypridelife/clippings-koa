import * as bcrypt from 'bcryptjs';

const docrypt = (value: string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(value, salt);
};

export default docrypt;
