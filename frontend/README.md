# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
## Câu 6. Đóng gói frontend bằng Docker và đẩy lên Docker Hub

Thực hiện các lệnh từ thư mục gốc của dự án. Cần cài Docker và đăng nhập Docker Hub.

1. Đăng nhập Docker Hub:
```bash
docker login
```

2. Build image và gắn tag. Thay URL dưới đây bằng địa chỉ backend có thể truy cập từ trình duyệt người dùng. Khi chạy backend local, dùng `http://localhost:5000/api/devices`:
```bash
docker build \
	--build-arg VITE_API_URL=https://your-backend-domain.example.com/api/devices \
	-t kichle33318/frontend-device-management:v1 \
	./frontend
```

3. Đẩy image lên Docker Hub:
```bash
docker push kichle33318/frontend-device-management:v1
```

4. Tải image từ Docker Hub và chạy để kiểm tra:
```bash
docker pull kichle33318/frontend-device-management:v1
docker run --name frontend-device-management -d -p 8080:80 kichle33318/frontend-device-management:v1
```

Mở `http://localhost:8080` để kiểm tra frontend. Nếu dùng API local, bỏ tham số `--build-arg` hoặc đặt `VITE_API_URL=http://localhost:5000/api/devices`. URL API được đóng gói vào frontend lúc build, vì vậy cần build và push lại image khi thay đổi URL.

Dừng container kiểm tra:
```bash
docker rm -f frontend-device-management
```