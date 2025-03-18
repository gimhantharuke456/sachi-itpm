import React, { useState, useEffect } from "react";
import { Card, Typography, InputNumber, Button, message } from "antd";
import { GiftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface PointBalanceProps {
  onApplyPoints: (pointsToRedeem: number) => void;
}

const PointBalance: React.FC<PointBalanceProps> = ({ onApplyPoints }) => {
  const [pointBalance, setPointBalance] = useState<number>(0);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // In a real application, you would fetch this from your API
    // For now, let's simulate fetching from localStorage or hardcode for demo
    const fetchPoints = () => {
      try {
        const userJson = localStorage.getItem("user");
        if (userJson) {
          const user = JSON.parse(userJson);
          // Assuming the user object has points
          // In a real app, you might need to make an API call
          setPointBalance(user.points?.balance || 122); // Fallback to 122 for demo
        } else {
          // Demo fallback
          setPointBalance(122);
        }
      } catch (error) {
        console.error("Error fetching points:", error);
        // Demo fallback
        setPointBalance(122);
      }
    };

    fetchPoints();
  }, []);

  const handleApplyPoints = () => {
    if (pointsToRedeem <= 0) {
      message.error("Please enter a valid number of points");
      return;
    }

    if (pointsToRedeem > pointBalance) {
      message.error("You cannot redeem more points than you have");
      return;
    }

    setLoading(true);

    // Simulate API call or processing
    setTimeout(() => {
      onApplyPoints(pointsToRedeem);
      message.success(`Applied ${pointsToRedeem} points to your order`);
      setPointBalance((prevBalance) => prevBalance - pointsToRedeem);
      setPointsToRedeem(0);
      setLoading(false);
    }, 500);
  };

  // Calculate LKR value (assuming 1 point = 1 LKR, adjust as needed)
  const pointsValue = pointBalance;

  return (
    <Card className="mb-4">
      <div className="flex items-center mb-4">
        <GiftOutlined
          style={{ fontSize: "24px", marginRight: "8px", color: "#1890ff" }}
        />
        <Title level={4} style={{ margin: 0 }}>
          Your Reward Points
        </Title>
      </div>

      <div className="mb-4">
        <Text>
          You have <strong>{pointBalance} points</strong> available. You can
          reduce your bill by up to <strong>LKR {pointsValue}</strong>.
        </Text>
      </div>

      <div className="flex items-center">
        <InputNumber
          min={0}
          max={pointBalance}
          value={pointsToRedeem}
          onChange={(value) => setPointsToRedeem(value || 0)}
          placeholder="Points to redeem"
          style={{ width: "150px" }}
        />
        <Button
          type="primary"
          onClick={handleApplyPoints}
          loading={loading}
          disabled={!pointsToRedeem || pointsToRedeem > pointBalance}
          style={{ marginLeft: "8px" }}
        >
          Apply Points
        </Button>
      </div>

      {pointsToRedeem > 0 && (
        <Text type="success" className="block mt-2">
          You will save LKR {pointsToRedeem} on your order
        </Text>
      )}
    </Card>
  );
};

export default PointBalance;
