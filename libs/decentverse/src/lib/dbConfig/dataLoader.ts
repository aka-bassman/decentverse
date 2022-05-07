import * as DataLoader from "dataloader";
import * as _ from "lodash";

export const createLoader = <Key, Value>(
  model: any,
  fieldName = "_id",
  defaultQuery: any = {}
) => {
  return new DataLoader<Key, Value>(
    (fields: any) => {
      const query: any = { status: { $ne: "inactive" }, ...defaultQuery };
      query[fieldName] = { $in: fields };
      const data = model.find(query).then((list: any) => {
        const listByKey = _.keyBy(list, fieldName);
        return fields.map((id: any) => _.get(listByKey, id, null));
      });
      return data;
    },
    { cache: false }
  );
};
export const createArrayLoader = <K, V>(
  model: any,
  fieldName = "_id",
  defaultQuery: any = {}
) => {
  return new DataLoader<K, V>((fields: any) => {
    const query: any = { status: { $ne: "inactive" }, ...defaultQuery };
    query[fieldName] = { $in: fields };
    const data = model.find(query).then((list: any) => {
      return fields.map((field: any) =>
        list.filter((item: any) => field.equals(item[fieldName]))
      );
    });
    return data;
  });
};
export const createArrayElementLoader = <K, V>(
  model: any,
  fieldName = "_id",
  defaultQuery: any = {}
) => {
  return new DataLoader<K, V>(
    (fields: any) => {
      const query: any = { status: { $ne: "inactive" }, ...defaultQuery };
      query[fieldName] = { $in: fields };
      const data = model.find(query).then((list: any) => {
        const flatMap = _.flatMap(list, (dat: any) =>
          dat[fieldName].map((datField: any) => ({
            ...dat.toObject(),
            key: datField,
          }))
        );
        const listByKey = _.groupBy(flatMap, (dat: any) => dat.key);
        return fields.map((id: any) => _.get(listByKey, id, null));
      });
      return data;
    },
    { cache: false }
  );
};
export const createPopulatedLoader = <K, V>(
  model: any,
  fieldName = "_id",
  populateFields: string[] = [],
  defaultQuery: any = {}
) => {
  return new DataLoader<K, V>(
    (fields: any) => {
      const query: any = { status: { $ne: "inactive" }, ...defaultQuery };
      query[fieldName] = { $in: fields };
      const data = populateFields
        .reduce(
          (fn: any, field: string) => fn.populate(field),
          model.find(query)
        )
        .then((list: any) => {
          const listByKey = _.keyBy(list, fieldName);
          return fields.map((id: any) => _.get(listByKey, id, null));
        });
      return data;
    },
    { cache: false }
  );
};
export const createArrayElementPopulatedLoader = <K, V>(
  model: any,
  fieldName = "_id",
  populateFields: string[] = [],
  defaultQuery: any = {}
) => {
  return new DataLoader<K, V>(
    (fields: any) => {
      const query: any = { status: { $ne: "inactive" }, ...defaultQuery };
      query[fieldName] = { $in: fields };
      const data = populateFields
        .reduce(
          (fn: any, field: string) => fn.populate(field),
          model.find(query)
        )
        .then((list: any) => {
          const flatMap = _.flatMap(list, (dat: any) =>
            dat[fieldName].map((datField: any) => ({
              ...dat.toObject(),
              key: datField,
            }))
          );
          const listByKey = _.groupBy(flatMap, (dat: any) => dat.key);
          return fields.map((id: any) => _.get(listByKey, id, null));
        });
      return data;
    },
    { cache: false }
  );
};
