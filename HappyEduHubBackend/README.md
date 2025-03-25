# Docs cho Frontender

## Setup backend

Clone cái repo này, nếu bạn không biết clone cái repo này, seek help!

Sử dụng nhánh main only

## Thêm file ENV

Đã gửi trong discord, sửa các thông tin tương ứng nếu cần thiết

## Migrate database

Mở xampp, chạy 3 dòng lệnh sau

npx sequelize-cli db:create

npx sequelize-cli db:migrate

npx sequelize-cli db:seed:all

Khi nào cần update database thì Backender sẽ báo trước

# Tài khoản sẵn:

| STT | Role            | Email                | Password  |
| --- | --------------- | -------------------- | --------- |
| 1   | STUDENT         | student1@example.com | 12345678  |
| 2   | STUDENT         | student2@example.com | 12345678  |
| 3   | TEACHER         | teacher1@example.com | 12345678  |
| 4   | TEACHER         | teacher2@example.com | 12345678  |
| 5   | ACADEMIC_AFFAIR | aafair1@example.com  | 12345678  |
| 6   | ACADEMIC_AFFAIR | aafair2@example.com  | 12345678  |
| 7   | ADMIN           | admin@example.com    | admin1234 |

## License

[MIT](https://choosealicense.com/licenses/mit/)
