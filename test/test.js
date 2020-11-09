const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Decentragram', ([deployer, author, tipper]) => {
    let decentragram

    before(async () => {
        decentragram = await Decentragram.deployed()
    })

    describe('deployment', async () => {
        it('deployed successfully', async () => {
            const address = await decentragram.address
            assert.notEqual(address, '0x0')
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await decentragram.name()
            assert.equal(name, 'Decentragram')
        })
    })

    describe('Images', async () => {
        let result
        let imageCount
        const hash = 'QSDVsvregg43567sdseyrhsbe456yaac34gdbb'

        before(async () => {
            result = await decentragram.uploadImage(hash, 'Image Description', { from: author})
            imageCount = await decentragram.imageCount()
        })

        it('create images', async () => {
            assert.equal(imageCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'Id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.description, 'Image Description', 'Desc. is correct')
            assert.equal(event.tipAmount, 0, 'Tip is correct')
            assert.equal(event.author, author, 'Author is correct')

            //FAILURES
            await decentragram.uploadImage('', 'Image Description', { from: author}).should.be.rejected
            await decentragram.uploadImage('hash', '', { from: author}).should.be.rejected
        })

        it('lists images', async () => {
            const image = await decentragram.images(imageCount)
            assert.equal(image.id.toNumber(), imageCount.toNumber(), 'Id is correct')
            assert.equal(image.hash, hash, 'Hash is correct')
            assert.equal(image.description, 'Image Description', 'Desc. is correct')
            assert.equal(image.tipAmount, 0, 'Tip is correct')
            assert.equal(image.author, author, 'Author is correct')

        })

        it('Allows user to tip image author', async () => {
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

            result = await decentragram.tipImageOwner(imageCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')})

            //success
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'hash is correct')
            assert.equal(event.description, 'Image Description', 'Desc. is correct')
            assert.equal(event.tipAmount, '1000000000000000000', 'Tip is correct')
            assert.equal(event.author, author, 'Author is correct')

            //check that author recieved funds
            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)

            let tipImageOwner
            tipImageOwner = web3.utils.toWei('1', 'Ether')
            tipImageOwner = new web3.utils.BN(tipImageOwner)
            
            const expectedBalance = oldAuthorBalance.add(tipImageOwner)

            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            //fail
            await decentragram.tipImageOwner(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
        })
    })
})