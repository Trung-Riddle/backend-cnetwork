### - SOLID là một nguyên tắc thiết kế phần mềm được áp dụng trong nhiều ngôn ngữ lập trình và cũng áp dụng trong backend Node.js. SOLID là viết tắt của các nguyên tắc sau đây:

1. **Single Responsibility Principle (SRP)**: Một class nên chỉ có một trách nhiệm duy nhất. Nói cách khác, một class nên chỉ thực hiện một công việc duy nhất và nếu cần thay đổi, thay đổi đó chỉ xảy ra vì một lý do duy nhất.

2. **Open/Closed Principle (OCP)**: Một class nên mở rộng được nhưng không được sửa đổi. Ý tưởng là bạn nên có thể mở rộng chức năng của một class thông qua kế thừa hoặc ghi đè phương thức, nhưng không được sửa đổi trực tiếp class đó.

3. **Liskov Substitution Principle (LSP)**: Các đối tượng của một lớp con nên có thể thay thế đối tượng của lớp cha mà không làm thay đổi tính đúng đắn của chương trình. Điều này đảm bảo rằng các lớp con không phá vỡ các quy tắc đã xác định bởi lớp cha.

4. **Interface Segregation Principle (ISP)**: Khách hàng không nên bị ép buộc thừa kế các phương thức mà họ không sử dụng. Thay vào đó, các giao diện nên được tách ra để chỉ chứa các phương thức cần thiết cho mỗi khách hàng cụ thể.

5. **Dependency Inversion Principle (DIP)**: Các module cấp cao không nên phụ thuộc trực tiếp vào các module cấp thấp. Cả hai nên phụ thuộc vào một abstraction. Điều này giúp giảm sự ràng buộc giữa các module và làm cho code dễ dàng mở rộng và thay đổi.

- SOLID giúp thiết kế và triển khai code một cách linh hoạt, dễ bảo trì và dễ mở rộng. Nó tạo ra cấu trúc rõ ràng, giảm sự phụ thuộc, và giúp giữ cho code dễ đọc và dễ hiểu. Áp dụng SOLID trong backend Node.js giúp tạo ra các ứng dụng linh hoạt, dễ kiểm thử, và dễ bảo trì.

### Application setup
- npm install typescript express dotenv
- npm install @types/express -D
- npm install cors helmet hpp cookie-session compression express-async-errors http-status-codes
- npm i --save-dev @types/cors @types/hpp @types/cookie-session @types/compression
- npm i --save-dev nodemon ts-node
- npm install --save-dev tsconfig-paths
- npm install @socket.io/redis-adapter redis socket.io
- npm i bunyan and npm i --save-dev @types/bunyan
- npm i -D eslint eslint-config-prettier prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
-  npm i @bull-board/express @faker-js/faker axios bcryptjs bull bullmq canvas cloudinary @bull-board/ui ejs @jest/types @sendgrid/mail joi
- npm i --save-dev @types/bcryptjs
- npm i jsonwebtoken lodash
- npm i --save-dev @types/lodash
- npm i --save-dev @types/jsonwebtoken

- npm install --save-dev tsc-alias

(- service/db -> worker -> queues -> controllers)
(- redis -> controllers)
