    **Steps to add debugger for solidity Test Cases**

`Run -> Edit Configurations`

`Templates`

`Click the + button to create a new configuration based on templates`

    _Refer: images/S1.png_

`From the dropdown menu select: npm`

    _Refer: images/S2.png_

`Fill up the following details in the dialog box`

_Name: debug-test_

_package.json: /path/to/package.json of your project_

_Scripts: test_

_Node interpreter: Select the latest version of node from the dropdown_

    _Refer: images/S3.png_

`Before launch: Activate tool window`

`Click on + icon -> Select Run External tool`

    _Refer: images/S4.png_
    
`Fill up the following details in the dialog box`

_Name: start testrpc_

_Program: /path/to/scripts/test.sh_

_Working directory: Populated automatically_

`Click OK`

`Refer: images/S5.png`
