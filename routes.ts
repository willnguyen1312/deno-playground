import {
  Application,
  Router,
  RouterContext,
} from "https://deno.land/x/oak/mod.ts";

import { Dog } from "./types.ts";

let dogs: Array<Dog> = [
  {
    name: "Roger",
    age: 8,
  },
  {
    name: "Syd",
    age: 7,
  },
];

export const router = new Router();

export const getDogs = ({ response }: RouterContext) => {
  response.body = dogs;
};

export const getDog = ({ params, response }: RouterContext) => {
  const dog = dogs.filter((dog) => dog.name === params.name);
  if (dog.length) {
    response.status = 200;
    response.body = dog[0];
    return;
  }

  response.status = 400;
  response.body = { msg: `Cannot find dog ${params.name}` };
};

export const addDog = async ({ request, response }: RouterContext) => {
  const body = await request.body();
  const dog: Dog = body.value;
  dogs.push(dog);

  response.body = { msg: "OK" };
  response.status = 200;
};

export const updateDog = async ({
  params,
  request,
  response,
}: RouterContext) => {
  const temp = dogs.filter((existingDog) => existingDog.name === params.name);
  const body = await request.body();
  const { age }: { age: number } = body.value;

  if (temp.length) {
    temp[0].age = age;
    response.status = 200;
    response.body = { msg: "OK" };
    return;
  }

  response.status = 400;
  response.body = { msg: `Cannot find dog ${params.name}` };
};

export const removeDog = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const lengthBefore = dogs.length;
  dogs = dogs.filter((dog) => dog.name !== params.name);

  if (dogs.length === lengthBefore) {
    response.status = 400;
    response.body = { msg: `Cannot find dog ${params.name}` };
    return;
  }

  response.body = { msg: "OK" };
  response.status = 200;
};

router
  .get("/dogs", getDogs)
  .get("/dogs/:name", getDog)
  .post("/dogs", addDog)
  .put("/dogs/:name", updateDog)
  .delete("/dogs/:name", removeDog);
