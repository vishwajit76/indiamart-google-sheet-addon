import React from 'react';
import ReactDOM from 'react-dom';
import SheetEditor from './components/SheetEditor';
import Form from './components/Form';
import './i18n';

import './styles.css';

import { SnackbarProvider } from 'notistack';

ReactDOM.render(<SnackbarProvider maxSnack={3}><Form /></SnackbarProvider>, document.getElementById('index'));
