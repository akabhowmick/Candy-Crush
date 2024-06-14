export const preset = 'ts-jest';
export const testEnvironment = 'jsdom';
export const transform = {
  '^.+\\.tsx?$': 'ts-jest',
};
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
export const testRegex = '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$';
export const moduleNameMapper = {
  '^@/(.*)$': '<rootDir>/src/$1',
};