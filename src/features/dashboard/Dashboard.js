import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer } from 'recharts';
import userService from '../../api/userService';
import AdminService from '../../api/AdminUserService';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [skillsStats, setSkillsStats] = useState([]);
  const [genderStats, setGenderStats] = useState([]);
  const [availabilityStats, setAvailabilityStats] = useState([]);

  // Récupération des données utilisateurs
  const fetchData = async () => {
    setLoading(true);
    try {
      const usersData = await AdminService.fetchUsers();
      setUsers(usersData);

      // --- Stats compétences ---
      const skillCountMap = {};
      usersData.forEach(user => {
        user.profile?.skills?.forEach(skill => {
          const skillName = skill.skill.name;
          if (skillCountMap[skillName]) skillCountMap[skillName] += 1;
          else skillCountMap[skillName] = 1;
        });
      });
      setSkillsStats(Object.entries(skillCountMap).map(([name, count]) => ({ name, count })));

      // --- Stats genre ---
      const genders = { M: 0, F: 0 };
      usersData.forEach(u => {
        if (u.profile?.sex) genders[u.profile.sex] += 1;
      });
      setGenderStats([
        { gender: 'Homme', count: genders.M },
        { gender: 'Femme', count: genders.F }
      ]);

      // --- Stats disponibilité ---
      const avail = { disponible: 0, indisponible: 0 };
      usersData.forEach(u => {
        if (u.profile?.availability) avail.disponible += 1;
        else avail.indisponible += 1;
      });
      setAvailabilityStats([
        { status: 'Disponible', count: avail.disponible },
        { status: 'Indisponible', count: avail.indisponible }
      ]);

    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spin tip="Chargement..." size="large" style={{ width: '100%', marginTop: 100 }} />;

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Utilisateurs" value={users.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Compétences Distinctes" value={skillsStats.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Utilisateurs Disponibles" value={availabilityStats.find(a => a.status === 'Disponible')?.count || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Distribution des compétences">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="count" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Répartition par genre">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderStats}>
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Disponibilité des utilisateurs">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={availabilityStats}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#faad14" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Évolution des compétences par utilisateurs">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={skillsStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#1890ff" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
