import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- Datos de Ejemplo (Debes reemplazarlos con una llamada a tu API) ---
const barData = [
  { name: 'Cat 1', value: 21, color: '#e63946' },
  { name: 'Cat 2', value: 43, color: '#f77f00' },
  { name: 'Cat 3', value: 39, color: '#ffb700' },
  { name: 'Cat 4', value: 56, color: '#ffd23e' },
  { name: 'Cat 5', value: 30, color: '#70e000' },
  { name: 'Cat 6', value: 28, color: '#40916c' },
];

const pieData = [
  { name: 'Detractors', value: 18, color: '#e63946' },
  { name: 'Passives', value: 44, color: '#3a86ff' },
  { name: 'Promoters', value: 38, color: '#06d6a0' },
];

const sentimentData = [6, 3, 9, 1, 0, 7]; 
// ---------------------------------------------------------------------

// Componente para el Gráfico de Sentimiento (Emojis)
const SentimentGauge = () => (
  <div className="sentiment-gauge">
    <div className="gauge-track">
      {['😔', '😞', '😐', '🙂', '😊', '😁'].map((emoji, index) => (
        <div key={emoji} className="sentiment-point">
          <span className="emoji">{emoji}</span>
          <div className="score-box" style={{ backgroundColor: barData[index].color }}>{sentimentData[index]}</div>
        </div>
      ))}
    </div>
    <div className="nps-labels">
        <span className="nps-label detractors">DETRACTORS</span>
        <span className="nps-label passives">PASSIVES</span>
        <span className="nps-label promoters">PROMOTERS</span>
    </div>
  </div>
);

const DashboardContent = () => (
  <div className="dashboard-grid">
    
    {/* BLOQUE 1: Gráfico de Barras */}
    <div className="card large-bar-chart">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <Bar dataKey="value" name="Valor" >
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Etiqueta de valores debajo de las barras - se puede lograr con etiquetas personalizadas en Recharts, pero lo simplificamos aquí */}
      <div className="bar-labels">
        {barData.map(d => <span key={d.name}>{d.value}</span>)}
      </div>
    </div>
    
    {/* BLOQUE 2: Gráfico de Dona/Anillo */}
    <div className="card small-ring-chart">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Leyendas y etiquetas del gráfico de dona */}
      <div className="ring-labels">
        {pieData.map(d => (
            <div key={d.name} className="ring-legend" style={{ color: d.color }}>{d.value}</div>
        ))}
      </div>
    </div>
    
    {/* BLOQUE 3: Escala de Sentimiento */}
    <div className="card full-width-gauge">
      <SentimentGauge />
    </div>
    
  </div>
);

export default DashboardContent;