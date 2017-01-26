import Woowahan from '../../../../index';

export default Woowahan.Schema.create('TodoSchema', {
  title: Woowahan.Types.String({ required: true, min: 1 })
});