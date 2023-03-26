

import NativeEvent from './exception/NativeEvent';
import App from './providers/App';

/**
 * Catches the process events
 */
NativeEvent.process();

/**
 * Clear the console before the app runs
 */
App.clearConsole();

/**
 * Load Configuration
 */
App.loadConfiguration();


/**
 * Run the Server
 */
App.loadServer();
