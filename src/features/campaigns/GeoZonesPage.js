import React, { useEffect, useState } from 'react';
import { Table, message, Spin } from 'antd';
import geoZoneService from '../../api/geoZoneService';

const GeoZonesPage = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await geoZoneService.list();
      setZones(data);
    } catch {
      message.error("Erreur lors du chargement des zones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Spin />;

  return (
    <Table
      dataSource={zones}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      columns={[
        { title: 'Nom', dataIndex: 'name', key: 'name' },
        { title: 'Polygone', dataIndex: 'polygon', key: 'polygon' }
      ]}
    />
  );
};

export default GeoZonesPage;
