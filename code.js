const API = 'https://www.themealdb.com/api/json/v1/1/'

const app = document.querySelector('.app')
const screen = {
  main: app.querySelector('.main-screen'),
  recipe: app.querySelector('.recipe-screen')
};

(async function(){
  const res = await fetch(`${API}list.php?c=list`)
  const data = await res.json()
  const categories = data.meals 
  console.log(categories)

  for(let index in categories){
    const div = document.createElement('div')
    div.innerText = categories[index].strCategory
    div.addEventListener('click', function(){
      screen.main.querySelector('.categories .active').classList.remove('active')
      div.classList.add('active')
      getRecipesOfCategory(categories[index].strCategory)
    })
    if(index === '0'){
      div.classList.add('active')
      getRecipesOfCategory(categories[index].strCategory)
    }
    screen.main.querySelector('.categories').appendChild(div)
  }
})()

async function getRecipesOfCategory(category){
  screen.main.querySelector('.recipe-list').innerHTML = '' // 초기화 
  try{
    const res = await fetch(`${API}filter.php?c=${category}`)
    const data = await res.json()
    const recipes = data.meals 
    console.log(recipes)

    for(let index in recipes){
      const div = document.createElement('div')
      div.classList.add('item')
      div.addEventListener('click', function(){
        showFullRecipe(recipes[index].idMeal)
      })
      div.innerHTML = `
        <div class='thumbnail'>
          <img src='${recipes[index].strMealThumb}'/>
        </div>
        <div class='details'>
          <h2>${recipes[index].strMeal}</h2>
        </div>
      `
      screen.main.querySelector('.recipe-list').appendChild(div)
    }
  }catch(e){
    console.log(e)
  }
}

async function showFullRecipe(receipeId){
  screen.main.classList.add('hidden')
  screen.recipe.classList.remove('hidden')
  screen.recipe.querySelector('.back-btn').addEventListener('click', function(){
    screen.recipe.classList.add('hidden')
    screen.main.classList.remove('hidden')
    screen.recipe.querySelector('.thumbnail img').src = ''
    screen.recipe.querySelector('.details h2').innerText = ''
    screen.recipe.querySelector('.details ul').innerHTML = ''
    screen.recipe.querySelector('.details ol').innerHTML = ''
  })
  try{
    const res = await fetch(`${API}lookup.php?i=${receipeId}`)
    const data = await res.json()
    const recipe = data.meals[0]
    console.log(recipe)

    screen.recipe.querySelector('.thumbnail img').src = recipe.strMealThumb
    screen.recipe.querySelector('.details h2').innerText = recipe.strMeal

    for(let i=1;i<20;i++){
      if(recipe[`strIngredient${i}`] === '' || recipe[`strIngredient${i}`] === null){
        continue;
      }
      const li = document.createElement('li')
      li.innerText = recipe[`strIngredient${i}`] + ' - ' + recipe[`strMeasure${i}`]
      screen.recipe.querySelector('.details ul').appendChild(li)
    }
    const instructions = recipe.strInstructions.split('\r\n').filter(v => v)
    console.log(instructions)

    for(let instruction of instructions){
      const li = document.createElement('li')
      li.innerText = instruction
      screen.recipe.querySelector('.details ol').appendChild(li)
    }
  }catch(e){
    console.log(e)
  }
}