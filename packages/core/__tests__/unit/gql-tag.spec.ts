import {gql} from '../../src';

describe('graphql tag test', () => {
  it('Empty.', () => {
    expect(gql``).toBe('');
  });

  it('Escapes.', () => {
    expect(gql`\``).toBe('`');
  });

  it('No variables.', () => {
    expect(gql`1`).toBe('1');
  });

  it('Only variables.', () => {
    // prettier-ignore
    expect(gql`${1}${2}${3}`).toBe('123');
  });

  it('Surrounding variables.', () => {
    expect(gql`${1}2${3}`).toBe('123');
  });

  it('Surrounded variables.', () => {
    expect(gql`1${2}${3}4`).toBe('1234');
  });
});
