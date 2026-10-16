# Devora — English for IT (React Native / Expo)

Ứng dụng mobile học tiếng Anh cho dân IT, giao diện lấy cảm hứng từ
[coderslingo.com](https://coderslingo.com), dữ liệu bài tập được crawl và xử lý
sẵn. Viết bằng **Expo + React Native + TypeScript** nên build được cả **iOS** và
**Android** từ cùng một codebase.

## Màn hình đã dựng
- **Splash** — logo linh vật "Pol" có animation, thanh loading, tự điều hướng
  sang Auth hoặc Home tuỳ trạng thái đăng nhập.
- **Auth** — đúng theo mockup: linh vật, tiêu đề, nút *Tiếp tục với Apple* /
  *Google*, dùng thử không cần đăng nhập, dòng điều khoản.
- **Home** — hero "quiz of the day", thống kê, nhóm lộ trình, lưới chủ đề.
- **Browse** (bonus) — tìm kiếm + lọc theo nhóm toàn bộ 69 chủ đề.

> Nút Apple/Google hiện là **đăng nhập demo** (lưu cờ cục bộ bằng AsyncStorage).
> Muốn đăng nhập thật cần thêm `expo-apple-authentication` / Google OAuth và
> backend — chưa nằm trong phạm vi UI clone này.

## Chạy app
```bash
cd devora-app
npm install          # hoặc: yarn
npx expo start       # quét QR bằng Expo Go, hoặc nhấn i / a
```
- iOS: `npx expo start --ios` (cần macOS + Xcode, hoặc Expo Go trên iPhone)
- Android: `npx expo start --android` (cần Android Studio/emulator, hoặc Expo Go)

## Build file cài đặt (EAS)
```bash
npm i -g eas-cli
eas build -p android   # .apk / .aab
eas build -p ios       # .ipa (cần tài khoản Apple Developer)
```

## Dữ liệu
- `src/data/catalog.json` — metadata nhẹ (69 chủ đề, 807 bài), load tức thì để
  duyệt.
- `src/data/categories/<slug>.json` — câu hỏi từng chủ đề, **lazy-load** qua
  `src/data/dataIndex.ts` khi mở chủ đề đó (tránh nặng bundle).
- Sinh lại từ HTML đã crawl: `python ../extract.py` rồi `python ../build_data.py`.

## Cấu trúc
```
src/
  components/   Mascot (SVG), ui (Pill, Card, ProgressBar...)
  data/         catalog + per-category json + loader
  navigation/   RootNavigator (Splash → Auth → Home → Browse)
  screens/      Splash, Auth, Home, Browse
  store/        progress (XP, streak, đăng nhập — AsyncStorage)
  theme.ts      màu/token thiết kế
```
