import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Layout,
  Breadcrumb,
  Card,
  Descriptions,
  Tag,
  Avatar,
  Row,
  Col,
  Spin,
  message,
  Button,
  Table,
  Typography,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  GlobalOutlined,
  DollarOutlined,
  RollbackOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import axiosInstance from "../services/axiosInstance";

const { Content } = Layout;
const { Paragraph } = Typography;

const statusColors = {
  en_attente: "orange",
  en_cours: "blue",
  terminee: "green",
  annulee: "red",
};

const applicationStatusColors = {
  en_attente: "orange",
  accepte: "green",
  refuse: "red",
  retire: "gray",
};

const MissionDetail = () => {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingMission, setLoadingMission] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);

  // Charge les détails de la mission
  const fetchMission = async () => {
    setLoadingMission(true);
    try {
      const response = await axiosInstance.get(`users/missions/${id}/`);
      setMission(response.data);
    } catch {
      message.error("Erreur lors du chargement de la mission");
    } finally {
      setLoadingMission(false);
    }
  };

  // Charge les applications liées à cette mission (détails enrichis)
  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const response = await axiosInstance.get(`users/mission-applications/${id}/`);
      // Ici on suppose que l'API renvoie la liste des applications directes
      // Sinon adapter selon modèle exact API (ex: response.data.applications)
      setApplications(Array.isArray(response.data) ? response.data : [response.data]);
    } catch {
      message.error("Erreur lors du chargement des candidatures");
    } finally {
      setLoadingApps(false);
    }
  };

  React.useEffect(() => {
    fetchMission();
    fetchApplications();
  }, [id]);

  const applicationsColumns = [
    {
      title: "Prestataire",
      key: "prestataire",
      render: (_, record) =>
        record.prestataire ? (
          <span>
            <Avatar
              src={record.prestataire.profile?.photo}
              icon={<UserOutlined />}
              size="small"
              style={{ marginRight: 8 }}
            />
            {record.prestataire.email}
          </span>
        ) : (
          "Non renseigné"
        ),
    },
    {
      title: "Nom",
      key: "name",
      render: (_, record) =>
        record.prestataire
          ? `${record.prestataire.profile?.first_name} ${record.prestataire.profile?.last_name}`
          : "-",
    },
    {
      title: "Sexe",
      key: "sex",
      render: (_, record) => record.prestataire?.profile?.sex || "-",
    },
    {
      title: "Zone Géographique",
      key: "zone",
      render: (_, record) => record.prestataire?.profile?.geographic_zone || "-",
    },
    {
      title: "Contact Email",
      key: "email",
      render: (_, record) =>
        record.prestataire?.contacts?.find((c) => c.contact_type === "email")?.value || "-",
    },
    {
      title: "Contact Téléphone",
      key: "phone",
      render: (_, record) =>
        record.prestataire?.contacts?.find((c) => c.contact_type === "phone")?.value || "-",
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={applicationStatusColors[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Date de candidature",
      dataIndex: "applied_at",
      key: "applied_at",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
  ];

  if (loadingMission || !mission) {
    return (
      <Spin tip="Chargement de la mission..." style={{ display: "block", marginTop: 100, textAlign: "center" }} />
    );
  }

  return (
    <Layout style={{ padding: 24, background: "#fff" }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Accueil
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/missions">Missions</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Détail</Breadcrumb.Item>
      </Breadcrumb>

      <Content>
        <Button
          style={{ marginBottom: 16 }}
          onClick={() => window.history.back()}
          icon={<RollbackOutlined />}
        >
          Retour
        </Button>

        <Card title={mission.title} bordered style={{ marginBottom: 24 }}>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Description">
              <Paragraph ellipsis={{ rows: 3 }}>{mission.description || "-"}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Zone Géographique">
              <GlobalOutlined /> {mission.geographic_zone || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Statut">
              <Tag color={statusColors[mission.status] || "default"}>{mission.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date de début">
              {mission.start_date ? new Date(mission.start_date).toLocaleString() : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Date de fin">
              {mission.end_date ? new Date(mission.end_date).toLocaleString() : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Prix">
              <DollarOutlined /> {mission.price || "-"} XOF
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card title="Client" bordered>
              {mission.client ? (
                <>
                  <Avatar
                    size={64}
                    src={mission.client.profile?.photo}
                    icon={<UserOutlined />}
                    style={{ marginBottom: 12 }}
                  />
                  <p>
                    <b>Nom :</b> {mission.client.profile?.first_name} {mission.client.profile?.last_name}
                  </p>
                  <p>
                    <b>Email :</b> {mission.client.email}
                  </p>
                  <p>
                    <b>Zone :</b> {mission.client.profile?.geographic_zone}
                  </p>
                  <p>
                    <b>Sexe :</b> {mission.client.profile?.sex}
                  </p>
                </>
              ) : (
                <p>Client non renseigné</p>
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Prestataire" bordered>
              {mission.prestataire ? (
                <>
                  <Avatar
                    size={64}
                    src={mission.prestataire.profile?.photo}
                    icon={<UserOutlined />}
                    style={{ marginBottom: 12 }}
                  />
                  <p>
                    <b>Nom :</b> {mission.prestataire.profile?.first_name} {mission.prestataire.profile?.last_name}
                  </p>
                  <p>
                    <b>Email :</b> {mission.prestataire.email}
                  </p>
                  <p>
                    <b>Zone :</b> {mission.prestataire.profile?.geographic_zone}
                  </p>
                  <p>
                    <b>Sexe :</b> {mission.prestataire.profile?.sex}
                  </p>
                </>
              ) : (
                <p>Prestataire non assigné</p>
              )}
            </Card>
          </Col>
        </Row>

        <Card title="Candidatures" bordered style={{ marginTop: 24 }}>
          <Table
            columns={applicationsColumns}
            dataSource={applications}
            rowKey="id"
            size="small"
            loading={loadingApps}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: "Aucune candidature trouvée" }}
            scroll={{ x: "max-content" }} // pour gérer les colonnes larges, scroll horizontal
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default MissionDetail;
