// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize(
//   'd1ahsdoqjuvvte',
//   'eiprerrwiofnoe',
//   '02f879a36d331f2da889e4f6353be109a00cd3616d06806c42e7f21c591edbe0',
//   {
//     host: 'ec2-34-195-69-118.compute-1.amazonaws.com',
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
// });
// const sequelize = new Sequelize(
//   'madison',
//   'root',
//   ''
  // {
  //   host: 'ec2-34-195-69-118.compute-1.amazonaws.com',
  //   dialect: 'postgres',
  //   dialectOptions: {
  //     ssl: {
  //       require: true,
  //       rejectUnauthorized: false,
  //     },
  //   },
  // }
// );
// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };
// export default connectDB;
const { Sequelize } = require("sequelize");

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize("madison", "root", null, {
  host: "localhost",
  dialect: "mysql",
  logging: false
});
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
export default connectDB;
