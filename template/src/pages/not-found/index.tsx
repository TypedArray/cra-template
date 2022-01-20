import { Button, Result, Space } from "@arco-design/web-react";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const onIndexClick = useCallback(() => {
    navigate("/");
  }, [navigate]);
  return (
    <div className="relative bg-gray-100 h-full">
      <Result
        className="absolute top-1/3 -translate-y-1/2"
        status="404"
        subTitle="您访问的页面不存在"
        extra={
          <Space>
            <Button type="primary" onClick={onIndexClick}>
              返回首页
            </Button>
          </Space>
        }
      />
    </div>
  );
}
