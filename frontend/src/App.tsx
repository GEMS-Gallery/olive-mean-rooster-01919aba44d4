import React, { useState } from 'react';
import { Container, Paper, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const Display = styled(Typography)(({ theme }) => ({
  background: '#e0e0e0',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'right',
  minHeight: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const CalcButton = styled(Button)(({ theme }) => ({
  minWidth: '64px',
  margin: theme.spacing(0.5),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const clearAll = () => {
    setDisplay('0');
    setWaitingForOperand(false);
    setPendingOperator(null);
    setPendingValue(null);
    backend.clearMemory();
  };

  const clearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (pendingValue === null) {
      setPendingValue(inputValue);
    } else if (pendingOperator) {
      setLoading(true);
      try {
        const result = await backend.calculate(pendingValue, inputValue, pendingOperator);
        if (result && result.length > 0) {
          setDisplay(result[0].toString());
          setPendingValue(result[0]);
        } else {
          setDisplay('Error');
          setPendingValue(null);
        }
      } catch (error) {
        console.error('Calculation error:', error);
        setDisplay('Error');
        setPendingValue(null);
      } finally {
        setLoading(false);
      }
    }

    setWaitingForOperand(true);
    setPendingOperator(nextOperator);
  };

  return (
    <Container maxWidth="sm">
      <CalculatorPaper>
        <Display variant="h4">
          {loading ? <CircularProgress size={24} /> : display}
        </Display>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <Grid container>
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((key) => (
                <Grid item xs={4} key={key}>
                  <CalcButton
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => key === '.' ? inputDecimal() : inputDigit(key)}
                  >
                    {key}
                  </CalcButton>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container direction="column">
              {['/', '*', '-', '+'].map((op) => (
                <Grid item key={op}>
                  <CalcButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => performOperation(op)}
                  >
                    {op}
                  </CalcButton>
                </Grid>
              ))}
              <Grid item>
                <CalcButton
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => performOperation('=')}
                >
                  =
                </CalcButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: '8px' }}>
          <Grid item xs={6}>
            <CalcButton
              variant="outlined"
              color="error"
              fullWidth
              onClick={clearAll}
            >
              AC
            </CalcButton>
          </Grid>
          <Grid item xs={6}>
            <CalcButton
              variant="outlined"
              color="error"
              fullWidth
              onClick={clearEntry}
            >
              <BackspaceIcon />
            </CalcButton>
          </Grid>
        </Grid>
      </CalculatorPaper>
    </Container>
  );
};

export default App;
