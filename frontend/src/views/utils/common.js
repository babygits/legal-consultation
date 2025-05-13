export const lawyerMajors = [
  {
    label: '民商事领域',
    options: [
      { label: '合同纠纷', value: 'contract_dispute' },
      { label: '婚姻家庭', value: 'family_law' },
      { label: '继承纠纷', value: 'inheritance_dispute' },
      { label: '侵权责任', value: 'tort_liability' },
      { label: '房地产与建设工程', value: 'real_estate_construction' },
      { label: '劳动争议', value: 'labor_dispute' },
      { label: '公司法务', value: 'corporate_law' },
      { label: '知识产权', value: 'intellectual_property' },
    ],
  },
  {
    label: '刑事领域',
    options: [
      { label: '刑事辩护', value: 'criminal_defense' },
      { label: '死刑复核', value: 'death_penalty_review' },
      { label: '取保候审', value: 'bail' },
      { label: '无罪辩护', value: 'innocence_defense' },
    ],
  },
  {
    label: '行政领域',
    options: [
      { label: '行政诉讼', value: 'administrative_litigation' },
      { label: '行政复议', value: 'administrative_reconsideration' },
      { label: '政府法律顾问', value: 'government_legal_advisor' },
      { label: '征地拆迁', value: 'land_expropriation' },
    ],
  },
  {
    label: '金融与资本市场',
    options: [
      { label: '银行与贷款', value: 'banking_loans' },
      { label: '证券与基金', value: 'securities_funds' },
      { label: '保险法务', value: 'insurance_law' },
      { label: '不良资产处置', value: 'nonperforming_assets' },
    ],
  },
  {
    label: '国际与涉外领域',
    options: [
      { label: '国际贸易', value: 'international_trade' },
      { label: '国际投资', value: 'international_investment' },
      { label: '涉外婚姻', value: 'foreign_marriage' },
      { label: '涉外继承', value: 'foreign_inheritance' },
      { label: '国际仲裁', value: 'international_arbitration' },
    ],
  },
  {
    label: '专项领域',
    options: [
      { label: '税务筹划', value: 'tax_planning' },
      { label: '环境保护', value: 'environmental_protection' },
      { label: '网络与数据合规', value: 'cyber_data_compliance' },
      { label: '反垄断与竞争法', value: 'antitrust_competition' },
      { label: '公益法律服务', value: 'public_interest_law' },
    ],
  },
];


export function getLawyerMajorLabels(values) {
  const labelMap = {};

  lawyerMajors.forEach(group => {
    group.options.forEach(item => {
      labelMap[item.value] = item.label;
    });
  });

  return values.map(val => labelMap[val] || val);
}

export function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
