import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Statistic, Spin, Button } from "antd";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

import campaignService from "../../api/campaignService";
import advertisementService from "../../api/advertisementService";
import promotionService from "../../api/promotionService";
import campaignPerformanceService from "../../api/campaignPerformanceService";

const AdvertisingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [ads, setAds] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [campaignData, adData, promoData, perfData] = await Promise.all([
          campaignService.fetchCampaigns(),
          advertisementService.fetchAdvertisements(),
          promotionService.fetchPromotions(),
          campaignPerformanceService.fetchCampaignPerformances(),
        ]);

        setCampaigns(campaignData);
        setAds(adData);
        setPromotions(promoData);
        setPerformance(perfData.map(p => ({
          date: p.date,
          views: p.views,
          clicks: p.clicks,
        })));
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const campaignColumns = [
    { title: "#", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Budget", dataIndex: "budget", key: "budget" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Zone", dataIndex: ["geo_zone", "name"], key: "zone" },
  ];

  if (loading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Advertising Dashboard</h1>

      {/* --- Summary Cards --- */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Campaigns" value={campaigns.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Advertisements" value={ads.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Promotions" value={promotions.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Clicks"
              value={performance.reduce((sum, d) => sum + d.clicks, 0)}
            />
          </Card>
        </Col>
      </Row>

      {/* --- Chart Section --- */}
      <Card title="Campaign Performance" style={{ marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performance}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#1890ff" name="Views" />
            <Bar dataKey="clicks" fill="#52c41a" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* --- Campaigns Table --- */}
      <Card title="Active Campaigns" style={{ marginTop: 24 }}>
        <Table columns={campaignColumns} dataSource={campaigns} rowKey="id" pagination={false} />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Button type="primary">View All</Button>
        </div>
      </Card>
    </div>
  );
};

export default AdvertisingDashboard;
