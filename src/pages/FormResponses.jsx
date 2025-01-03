import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './FormResponses.module.css';
import Table from './Table';
import api from '../data/api';

const Card = ({ title, children, className }) => (
  <div className={`${styles.card} ${className || ''}`}>
    {title && <div className={styles.cardHeader}>{title}</div>}
    <div className={styles.cardContent}>{children}</div>
  </div>
);

const FormResponses = ({ formId }) => {
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState({
    views: 0,
    starts: 0
  });

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/forms/formsbot/${formId}/responses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // const data = await response.json();
        console.log(response);
        const { data } = response;

        if (data.success) {
          setResponses(data.responses); // Use data.responses, not just responses
          
          const viewCount = data.responses.length;
          const startCount = data.responses.filter((r) => r.responses.length > 0).length;
          const completedCount = data.responses.filter((r) => r.status === "completed").length;
    
          setStats({
            views: viewCount,
            starts: startCount,
            completed: completedCount,
          });
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };

    fetchResponses();
  }, [formId]);

  const COLORS = ['#1a5fff', '#718096'];
  const pieData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Incomplete', value: stats.starts - stats.completed }
  ];

  // const getColumnHeaders = () => {
  //   const headers = new Set();
  //   responses.forEach(response => {
  //     response.responses.forEach(r => {
  //       headers.add(r.elementLabel);
  //     });
  //   });
  //   return ['Submitted at', ...Array.from(headers)];
  // };

  // const formatResponseData = (response) => {
  //   const baseData = {
  //     'Submitted at': new Date(response.startedAt).toLocaleString()
  //   };
    
  //   response.responses.forEach(r => {
  //     baseData[r.elementLabel] = r.response;
  //   });
    
  //   return baseData;
  // };

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Views</div>
          <div className={styles.statValue}>{stats.views}</div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Starts</div>
          <div className={styles.statValue}>{stats.starts}</div>
        </Card>
      </div>

      <Card title="Form Responses" className={styles.tableCard}>
        <Table data={responses} />
      </Card>

      <Card className={styles.chartCard}>
        <div className={styles.chartContainer}>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.completionRate}>
            <div className={styles.rateNumber}>
              {stats.starts ? Math.round((stats.completed / stats.starts) * 100) : 0}%
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormResponses;