import { decodeContentFromMdFile, englishToFrench, parseMDText, translateToFrench } from '../utils/utils';
import { describe, it, expect } from '@jest/globals';

describe('Utils function', () => {
  describe('parseMDText', () => {
    it('should parse the given MD text', () => {
      const mdText = '---\n Ceci est le detail \n---\n - Ceci est le content';

      const result = parseMDText(mdText);
      expect(result.details).toBe('---\n Ceci est le detail \n---\n');
      expect(result.content).toBe(' - Ceci est le content');
    });

    it('should return nothung if the given MD text is empty', () => {
      const mdText = '';
      const result = parseMDText(mdText);

      expect(result.details).toBe('');
      expect(result.content).toBe('');
    });
  });

  describe('decodeContentFromMdFile', () => {
    it('should return n/a if there is nothing', () => {
      const content = '';
      const result = decodeContentFromMdFile(content);

      expect(result).toEqual([
        {
          status: 'n/a',
          url: 'n/a',
        },
      ]);
    });

  });

  describe('translateToFrench', () => {
    it('should translate english in french words', () => {
      const english = 'title: Test incubator: Test';
      const expectedText = 'Nom du service: Test Portée par: Test';

      const result = translateToFrench(english, englishToFrench);

      expect(result).toBe(expectedText);
    });
  });
});
