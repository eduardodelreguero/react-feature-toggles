import { curry } from 'ramda';
import getIsEnabled from './get-is-enabled';
import updateFeatures from './update-features-with-query';
import { parse } from 'url';

const setStatus = (res, isEnabled) =>
  isEnabled ? res.status(200) : res.status(404);

const createRoute = (features, { requiredFeature, ...methods }) => (
  req,
  res,
  next
) => {
  const parsedUrl = parse(req.url, true);
  const { query } = parsedUrl;
  const updatedFeatures = updateFeatures(features, query);
  setStatus(res, getIsEnabled(updatedFeatures, requiredFeature));

  const handler = methods[req.method.toLowerCase()];
  if (handler !== undefined && typeof handler === 'function') {
    return handler(req, res);
  }

  next();
};

export default curry(createRoute);
