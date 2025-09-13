// PrestataireCard.jsx

import React from 'react';
import { Card, Avatar, Typography, Tag } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const PrestataireCard = ({ user, onSeeDetails }) => {
  const fullName = `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`;
  const location = user.profile?.geographic_zone || 'Localisation non renseignée';
  const phoneContact = (user.contacts || []).find(c => c.contact_type?.toLowerCase() === 'phone');

  return (
    <Card
      hoverable
      onClick={() => onSeeDetails && onSeeDetails(user)}
      style={{
        cursor: 'pointer',
        flexGrow: 1,
        borderRadius: 16,
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 420,
        padding: 16,
        position: 'relative',
        userSelect: 'none',
      }}
      bodyStyle={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
      }}
      cover={
        user.profile?.photo ? (
          <img
            alt={fullName}
            src={user.profile.photo}
            style={{
              width: '100%',
              height: 180,
              objectFit: 'cover',
              borderRadius: '16px 16px 0 0',
            }}
          />
        ) : (
          <div
            style={{
              height: 180,
              width: '100%',
              backgroundColor: '#e6f7ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '16px 16px 0 0',
            }}
          >
            <Avatar size={96} icon={<UserOutlined />} />
          </div>
        )
      }
    >
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <Title level={4} style={{ margin: 0 }}>{fullName}</Title>
        <Text type="secondary">{location}</Text>
      </div>

      <div style={{ marginTop: 8, flexShrink: 0 }}>
        <Title level={5} style={{ marginBottom: 8 }}>Compétences clés</Title>
        {user.skills && user.skills.length > 0 ? (
          <Paragraph ellipsis={{ rows: 2 }}>
            {user.skills.slice(0, 3).map(s => s.skill.name).join(', ')}
          </Paragraph>
        ) : (
          <Paragraph italic style={{ color: '#999' }}>Aucune compétence renseignée</Paragraph>
        )}
      </div>

      {phoneContact && (
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <Tag icon={<PhoneOutlined />} color="#52c41a">
            {phoneContact.value}
          </Tag>
        </div>
      )}
    </Card>
  );
};

export default PrestataireCard;
