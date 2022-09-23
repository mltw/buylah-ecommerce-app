import styled from 'styled-components';
import { Row, Col } from 'antd';
import shopping from '../shopping.jpg';

const StyledRow = styled(Row)`
  min-height: 100vh;
  background-image: url(${shopping});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const StyledCol = styled(Col)`
    background: rgba(255, 255, 255, 0.85);
    padding: 20px 30px 20px 30px;
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048), 
                0 12.5px 10px rgba(0, 0, 0, 0.06), 0 22.3px 17.9px rgba(0, 0, 0, 0.072), 
                0 41.8px 33.4px rgba(0, 0, 0, 0.086), 0 100px 80px rgba(0, 0, 0, 0.12);
    borderRadius: 5px
`
const StepsContent = styled.div`
    min-height: 200px;
    margin-top: 16px;
    padding: 15px;
    text-align: center;
    backgroundColor: #fafafa;
    border: 1px dashed #e9e9e9;
    border-radius: 2px;
`

const StepsAction = styled.div`
    margin-top: 24px;
`

export { StyledRow, StyledCol, StepsContent, StepsAction }