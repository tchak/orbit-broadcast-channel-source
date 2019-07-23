import { Schema } from '@orbit/data';
import BroadcastChannelSource from '../src/index';

const { module, test } = QUnit;

module('BroadcastChannelSource', function(hooks) {
  let schema: Schema;
  let source: BroadcastChannelSource;

  hooks.beforeEach(async () => {
    schema = new Schema({
      models: {
        planet: {
          attributes: {
            name: { type: 'string' },
            classification: { type: 'string' },
            lengthOfDay: { type: 'number' }
          },
          relationships: {
            moons: { type: 'hasMany', model: 'moon', inverse: 'planet' },
            solarSystem: {
              type: 'hasOne',
              model: 'solarSystem',
              inverse: 'planets'
            }
          }
        },
        moon: {
          attributes: {
            name: { type: 'string' }
          },
          relationships: {
            planet: { type: 'hasOne', model: 'planet', inverse: 'moons' }
          }
        },
        solarSystem: {
          attributes: {
            name: { type: 'string' }
          },
          relationships: {
            planets: {
              type: 'hasMany',
              model: 'planet',
              inverse: 'solarSystem'
            },
            moons: {
              type: 'hasMany',
              model: 'moon',
              inverse: 'solarSystem'
            }
          }
        }
      }
    });

    source = new BroadcastChannelSource({ schema });

    await source.activated;
  });

  hooks.afterEach(async () => {
    await source.deactivate();
    schema = source = null;
  });

  test('it exists', function(assert) {
    assert.ok(source);
  });
});
