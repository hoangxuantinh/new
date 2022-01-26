// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryTypes } from 'sequelize';
import cron from 'node-cron';
import db from '../models/index';
import transporter from '../ultils/sendEmail';

export const autoSendMail = async () => {
    try {
        const hour = new Date().toTimeString().slice(0, 8);
        const sql = `select u.*,c.name,t.timeStart,d.index,d.name dayName from users u
        inner join userclasses ul on u.id = ul.userId
        inner join classes c on c.id = ul.classId
        inner join classtimes ct on ct.classId = c.id
        inner join times t on t.id = ct.timeId
        inner join dayofweeks d on d.id = ct.dayId
        inner join registers r on r.userId = u.id and c.id = r.classId
        where r.status = 'confirmed' and HOUR(:hour) + 4 >= HOUR(t.timeStart)
        and HOUR(t.timeStart) >= HOUR(:hour) ;`;

        const data = await db.sequelize.query(
            sql,
            { replacements: { hour } },
            { type: QueryTypes.SELECT }
        );
        data[0].forEach((element) => {
            const day = element.index;
            const hours = +(element.timeStart.slice(0, 2)) - 4;
            cron.schedule(`* ${hours} * * ${day}`, () => {
                const message = {
                    from: process.env.EMAIL_SERVER,
                    to: element.email,
                    subject: 'Thông báo lịch học',
                    html: `<p>Bạn sẽ có lớp học sau 4 tiếng nữa </p>
                    `
                };
                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Email sent: ', info);
                    }
                });
            });
        });
    } catch (error) {
        console.log('error', error);
    }
};
autoSendMail();
