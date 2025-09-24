import _helmet from 'helmet';

const helmet = _helmet({
  contentSecurityPolicy: false,
});

export default helmet;
