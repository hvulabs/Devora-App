# Devora — English for IT

Ứng dụng học tiếng Anh cho ngành công nghệ, xây bằng Expo, React Native và TypeScript.

## Tính năng
- Luồng Splash → đăng nhập/khách → Home/Browse → Category → Exercise → Result.
- 69 chủ đề và dữ liệu câu hỏi offline-first, lazy-load theo chủ đề.
- XP, mục tiêu XP hằng ngày, streak, kỷ lục, huy hiệu và lịch sử được lưu bằng AsyncStorage.
- Hồ sơ, cài đặt âm thanh/thông báo/ngôn ngữ/theme, VI/EN và giao diện sáng/tối.
- Apple Sign In trên iOS và Google OIDC; chế độ khách luôn khả dụng.

## Chạy và kiểm tra
```bash
npm install
npm start
npm run typecheck
npm test
```

`npm run test:e2e` chạy `.maestro/main-flow.yaml`; cần cài Maestro và một development build trên simulator/thiết bị.

## Đăng nhập
Tạo OAuth client IDs cho iOS, Android và Web trong Google Cloud Console, sau đó điền các biến trong `.env.example` vào `.env` khi chạy local hoặc cấu hình chúng trong EAS Environment Variables. Các `EXPO_PUBLIC_*` client ID là giá trị công khai, không đặt private client secret ở đây. Redirect scheme của app là `devora`.

Apple Sign In cần capability trên Apple Developer và development build iOS; Expo Go không hỗ trợ kiểm thử đầy đủ. Đăng nhập hiện nhận diện nhà cung cấp trên thiết bị và giữ tiến độ local; chưa có backend để xác minh token hoặc đồng bộ tài khoản giữa nhiều thiết bị. URL điều khoản/quyền riêng tư trong Auth cũng cần thay bằng URL chính thức trước khi phát hành.

## EAS Build
`eas.json` có các profile `development`, `preview` (Android APK) và `production` (Android AAB/iOS). App icon, Android adaptive icon và splash nằm trong `assets/`.

```bash
npx eas-cli login
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform android --profile production
npx eas-cli build --platform ios --profile production
```

Build iOS, ký ứng dụng và gửi store cần tài khoản Apple Developer; phát hành Google Play cần tài khoản Play Console. Chưa thể submit store hoặc xác nhận thiết bị thật nếu chưa có các tài khoản/chứng chỉ đó.

## Dữ liệu và QA
- `src/data/catalog.json`: 69 chủ đề, 807 bài luyện.
- `src/data/categories/<slug>.json`: dữ liệu câu hỏi được nạp theo yêu cầu.
- Unit tests bao phủ tiến độ XP/streak/kỷ lục/huy hiệu và loader dữ liệu. Parser Python chưa được kiểm thử trong workspace này vì các script crawl không có ở đây.
