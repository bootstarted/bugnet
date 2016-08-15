/* eslint no-console: 0 */
import capture from 'bugnet';

capture((error) => {
  console.log('bugnet detected an error', error);
});
