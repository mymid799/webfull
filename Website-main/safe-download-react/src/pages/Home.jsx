import React from "react";
import Card from "../components/Card";
import Tag from "../components/Tag";

export default function Home() {
  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 16px" }}>
      <Card title="Giới thiệu" accent="#ffe8a3">
        <p>
          Safe Download Web là nền tảng tải phần mềm an toàn, giúp người dùng
          tránh các rủi ro khi tải ứng dụng từ nguồn không chính thống. Website
          cung cấp các liên kết tải Windows, Office, Tools, Free Antivirus… hoàn
          toàn sạch, kèm mã SHA256 để xác thực tính toàn vẹn của file. Giải pháp
          được xây dựng nhằm đảm bảo an toàn thông tin và bảo mật hệ thống, hỗ
          trợ người dùng và doanh nghiệp tải phần mềm đúng nguồn, không chứa mã
          độc, góp phần tạo môi trường số an toàn và tin cậy.
        </p>
        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}
        ></div>
      </Card>
    </div>
  );
}
