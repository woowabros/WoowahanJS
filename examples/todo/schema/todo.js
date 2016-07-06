import Woowahan from '../../../';

export default Woowahan.Schema.create('TodoSchema', {
  title: Woowahan.Types.String({ required: true, min: 1 })
});