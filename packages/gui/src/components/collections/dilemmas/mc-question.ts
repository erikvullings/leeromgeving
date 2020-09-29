import m, { FactoryComponent } from 'mithril';
import { RadioButtons } from 'mithril-materialized';
import { render } from 'mithril-ui-form';
import { IDilemma } from '../../../models';
import { range, shuffle, toLetters } from '../../../utils';

export const MultipleChoiceQuestion: FactoryComponent<{ question: Partial<IDilemma> }> = () => {
  const toRadioGroup: FactoryComponent<{ arr: string[]; order: number[]; callback: (index: number) => void }> = () => {
    return {
      view: ({ attrs: { arr, order, callback } }) => {
        return m(RadioButtons, {
          options: order.map((o, i) => ({
            id: o,
            label:
              toLetters(i + 1) +
              '. ' +
              render(arr[o])
                .replace(/<\/?p>/g, '')
                .trim(),
          })),
          onchange: (id) => callback(+id),
        });
      },
    };
  };

  const toOrderedList: FactoryComponent<{ arr: string[]; order: number[] }> = () => {
    return {
      view: ({ attrs: { arr, order } }) =>
        m(
          'ol[type=A]',
          order.map((o) =>
            m(
              'li',
              render(arr[o])
                .replace(/<\/?p>/g, '')
                .trim()
            )
          )
        ),
    };
  };

  let answered = false;
  let correct = false;
  let randomized: number[];

  return {
    view: ({ attrs: { question } }) => {
      const { title, desc = '', notes = '' } = question;

      const options = desc.split(/- /).filter(Boolean);
      const feedback = notes.split(/- /).filter(Boolean);

      if (options.length < 2) {
        return;
      }
      console.log(options);
      randomized = randomized || shuffle(range(0, options.length - 1));

      const correctAnswer = toLetters(randomized.indexOf(0) + 1);
      return m('.multiple-choice-question', [
        m('p', title),
        m(toRadioGroup, {
          arr: options,
          order: randomized,
          callback: (id) => {
            answered = true;
            correct = id === 0;
          },
        }),
        answered && [
          m(
            'p',
            m(
              'b',
              correct
                ? `Goed gedaan, antwoord ${correctAnswer} was correct!`
                : `Helaas, ${correctAnswer} was het correcte antwoord.`
            )
          ),
          notes && feedback.length === options.length
            ? m(toOrderedList, { arr: feedback, order: randomized })
            : m('p', notes),
        ],
      ]);
    },
  };
};
