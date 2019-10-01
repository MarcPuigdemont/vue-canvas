# Intoduction

I finished the test meeting all the requirements/features listed on the [REQUIREMENTS.md](REQUIREMENTS.md) file using a whole full day of work (with breaks to eat and a couple of interruptions). I took a bit of extra time to make sure everything is well documented on this file.

## Things taken into consideration

- I added some libraries, such as:
    - bootstrap instead of the file
    - bodyparser and cors for the server
    - axios for the http request to the server
    - rxjs for reactivity between server/components
    - Typescript, I've used the object model, not the class model, but still we have types and interfaces for sanity
    - cypress-mouse-position, probably is not needed but I couldn't make it work without it (didn't spent much time trying it witout them)
    - cypress-file-upload, to test the ImageForm component
- Performance:
    - I used the event delegation on the drag functionality so it should support more items
    - I used transform/translate vs top/left so the browser only needs to re-render the dragged item
    - Only the current item is sent to the server when added/updated/removed so it should take less bandwith

## Things I left out

- Test, tests, and more tests. I take them really seriusly as they are the base of any sane project. I would love to have more time to better wrap it all up. I didn't have time to finish all the unit test needed and e2e/integration is pretty basic.
- I didn't follow the TDD methodology but I didn't leave all the test for the last part. I did make them as I went.
- E2E / Integration can only be run once, then you have to manually delete the uploaded image :(
- RxJS for mouse events. I've seen it is very powerful to control streams of events, but since the requirements suggested to use native events, I didn't use them for this purpose.
- I could have randomized the size and text of the new added items.
- No time at all to implement resize item.

# Architecture

The app is based on some components. Each component has it's style scoped.

### Canvas

[Here is](src/components/Canvas.vue) where the user can add, delete, and drag the items aroud.

### CanvasItem

[It](src/components/CanvasItem.vue) represents each item on the canvas and it's resposibility is to update the dom element with the item model with things such as position, size, border depending on selected item. It is also responsible for instantiating the right Item Component, [CanvasItemImage](src/components/CanvasItemImage.vue)/[CanvasItemText](src/components/CanvasItemText.vue).

### CanvasItemImage

[It](src/components/CanvasItemImage.vue) will display the images stored on the model of the item

### CanvasItemText

[It](src/components/CanvasItemText.vue) will display the text stored on the model of the item

### Handler

[It](src/components/Handler.vue) is a bounding box placed over the selected item with a button that allows to delete the item. If I had time, here is where resize handling boxes and logic would have gone.

### ImageForm

[It](src/components/ImageForm.vue) is used to upload new images. The logic of the form is here, but the one to actually upload the file is on the [imageService](src/utils/services.ts).

### ImageList

[Here](src/components/ImageList.vue) are displayed all the images from the /images folder

### TextAdd

[This](src/components/TextAdd.vue) is the compoent used to add text to the canvas. The text is always the same.

### Utils

I have created a couple of [services](src/utils/services.ts) to link the server with the frontend using an RxJS Observable. These services also include the methods to add/update/delete items, and to upload new images.

# Server Architecture

I have followed the REST standard, this is the API:

- GET /items: returns all items
- POST /items: used for testing, to reset the state before every run
- POST /item: adds a new item
- PUT /item ({ index, item}): modifies an existing item
- DELETE /item: deletes an item
- GET /images: returns all images from the /images folder
- POST /uploads: adds a new image to the /images folder

# Testing

Unit testing is located inside [components folder/tests/unit](src/components/tests/unit) and there is a test file for almos each component. I didn't have time to test the [Handler](src/components/Handler.vue), the [ImageForm](src/components/ImageForm.vue) and [TextAdd](src/components/TextAdd.vue).

E2E Testing is located inside [cypress/integration](cypress/integration/main.spec.ts) as it's generated automatically. There no specifica test files but one which tests the behavior of teh app.

# How To Install and Develop

To set up the environment dependencies

```
$ npm install
```

To run the node server

```
$ npm run start-server
```

To run the client

```
$ npm run start-client
```

To run unit tests

```
$ npm run test:unit
```

To run e2e tests

```
$ npm run test:e2e
```
